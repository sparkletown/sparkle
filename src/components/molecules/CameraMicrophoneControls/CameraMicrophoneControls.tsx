import React, { useCallback } from "react";
import classNames from "classnames";
import Video, {
  AudioTrackPublication,
  VideoTrackPublication,
} from "twilio-video";

import { ContainerClassName } from "types/utility";

import { VideoOverlayButton } from "components/atoms/VideoOverlayButton";

import "components/molecules/CameraMicrophoneControls/CameraMicrophoneControls.scss";

const setTrackStateTo = (enable: boolean) => ({
  track,
}: AudioTrackPublication | VideoTrackPublication) => {
  if (!track) {
    return;
  }
  if (enable && "enable" in track) {
    track.enable();
    return;
  }
  if ("disable" in track) {
    track.disable();
    return;
  }
};

export interface CameraMicrophoneControlsProps extends ContainerClassName {
  participant: Video.Participant;
  defaultMute: boolean;
}

export const CameraMicrophoneControls: React.FC<CameraMicrophoneControlsProps> = ({
  participant,
  defaultMute,
  containerClassName,
}) => {
  const changeAudioState = useCallback(
    (state) => participant.audioTracks.forEach(setTrackStateTo(state)),
    [participant.audioTracks]
  );

  const changeVideoState = useCallback(
    (state) => participant.videoTracks.forEach(setTrackStateTo(state)),
    [participant.videoTracks]
  );

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
