import React from "react";

import { ButtonConfig } from "../VideoHuddle/useVideoHuddle";

import { AudioTrackPlayer } from "./internal/AudioTrackPlayer";
import { ExtraButton } from "./internal/ExtraButton";
import { VideoCommsControls } from "./internal/VideoCommsControls";
import { Participant } from "./types";
import { VideoTrackDisplay } from "./VideoTrackDisplay";

interface VideoCommsParticipantProps {
  participant: Participant;
  isLocal?: boolean;
  extraButtons?: ButtonConfig[];
}

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
