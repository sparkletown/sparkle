import React, { useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ButtonConfig } from "../VideoHuddle/useVideoHuddle";

import { AudioTrackPlayer } from "./internal/AudioTrackPlayer";
import { Participant, VideoTrack } from "./types";
import { VideoCommsControls } from "./VideoCommsControls";
import { VideoTrackDisplay } from "./VideoTrackDisplay";

interface VideoCommsParticipantProps {
  participant: Participant;
  isLocal?: boolean;
  extraButtons?: ButtonConfig[];
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
      {isLocal && <VideoCommsControls />}
    </>
  );
};
