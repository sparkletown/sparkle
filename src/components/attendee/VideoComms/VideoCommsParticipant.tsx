import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ButtonConfig } from "../VideoHuddle/useVideoHuddle";

import { AudioTrackPlayer } from "./internal/AudioTrackPlayer";
import { useVideoComms } from "./hooks";
import { LocalParticipant, Participant, VideoTrack } from "./types";
import { VideoTrackDisplay } from "./VideoTrackDisplay";

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
  // TODO Mirroring and screen shares...

  return (
    <>
      {participant.videoTracks.map((track) => (
        <React.Fragment key={track.id}>
          <VideoTrackDisplay
            key={track.id}
            track={track}
            isMirrored={isLocal}
          />
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
