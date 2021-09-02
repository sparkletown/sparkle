import React, { useCallback } from "react";
import classNames from "classnames";
import Video, {
  AudioTrackPublication,
  VideoTrackPublication,
} from "twilio-video";

import { ContainerClassName } from "types/utility";

import { VideoOverlayButton } from "components/atoms/VideoOverlayButton";

import "components/molecules/CameraMicrophoneControls/CameraMicrophoneControls.scss";

export interface CameraMicrophoneControlsProps extends ContainerClassName {
  participant: Video.Participant;
  defaultMute: boolean;
}

export const CameraMicrophoneControls: React.FC<CameraMicrophoneControlsProps> = ({
  participant,
  defaultMute,
  containerClassName,
}) => {
  const getChangeStateHandler = useCallback(
    (variant: "microphone" | "camera"): ((enabled: boolean) => void) => {
      const tracks =
        variant === "microphone"
          ? participant.audioTracks
          : participant.videoTracks;

      return (enable: boolean) => {
        tracks.forEach(
          (track: AudioTrackPublication | VideoTrackPublication) => {
            const innerTrack = track.track;
            if (innerTrack) {
              if (enable && "enable" in innerTrack) innerTrack.enable();
              else if ("disable" in innerTrack) innerTrack.disable();
            }
          }
        );
      };
    },
    [participant.audioTracks, participant.videoTracks]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const changeAudioState = useCallback(getChangeStateHandler("microphone"), [
    getChangeStateHandler,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const changeVideoState = useCallback(getChangeStateHandler("camera"), [
    getChangeStateHandler,
  ]);
  return (
    <div className={classNames("CameraMicrophoneControls", containerClassName)}>
      <VideoOverlayButton
        variant="microphone"
        onEnabledChanged={changeAudioState}
        defaultValue={!defaultMute}
      />
      <VideoOverlayButton
        variant="camera"
        onEnabledChanged={changeVideoState}
        defaultValue={true}
      />
    </div>
  );
};
