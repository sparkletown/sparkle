import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { AudioTrackPlayer } from "../VideoComms/AudioTrackPlayer";
import { useVideoComms } from "../VideoComms/hooks";
import { LocalParticipant, Participant, VideoTrack } from "../VideoComms/types";
import { VideoTrackDisplay } from "../VideoComms/VideoTrackDisplay";
import { ButtonConfig } from "../VideoHuddle/useVideoHuddle";

interface VideoCommsParticipantProps {
  participant: Participant;
  isLocal?: boolean;
  extraButtons?: ButtonConfig[];
}

interface VideoCommsControlsProps {
  participant: LocalParticipant;
}
interface ExtraButtonProps {
  buttonConfig: ButtonConfig;
  track: VideoTrack;
}

const ExtraButton: React.FC<ExtraButtonProps> = ({ buttonConfig, track }) => {
  const clickHandler = useCallback(() => {
    buttonConfig.callback({ track });
  }, [buttonConfig, track]);
  return <FontAwesomeIcon icon={buttonConfig.icon} onClick={clickHandler} />;
};

const VideoCommsControls: React.FC<VideoCommsControlsProps> = ({
  participant,
}) => {
  const {
    startAudio,
    stopAudio,
    startVideo,
    stopVideo,
    isTransmittingAudio,
    isTransmittingVideo,
  } = useVideoComms();

  return (
    <>
      {isTransmittingAudio ? (
        <span onClick={stopAudio}>Mute</span>
      ) : (
        <span onClick={startAudio}>Unmute</span>
      )}
      {isTransmittingVideo ? (
        <span onClick={stopVideo}>Hide</span>
      ) : (
        <span onClick={startVideo}>Reveal</span>
      )}
    </>
  );
};

export const VideoCommsParticipant: React.FC<VideoCommsParticipantProps> = ({
  participant,
  isLocal,
  extraButtons = [],
}) => {
  // TODO Mirroring

  return (
    <>
      {participant.videoTracks.map((track) => (
        <React.Fragment key={track.id}>
          <VideoTrackDisplay key={track.id} track={track} />
          {extraButtons.map((buttonConfig, idx) => (
            <ExtraButton key={idx} buttonConfig={buttonConfig} track={track} />
          ))}
        </React.Fragment>
      ))}
      {participant.audioTracks.map((track) => (
        <AudioTrackPlayer key={track.id} track={track} />
      ))}
      {isLocal && (
        <VideoCommsControls participant={participant as LocalParticipant} />
      )}
    </>
  );
};
