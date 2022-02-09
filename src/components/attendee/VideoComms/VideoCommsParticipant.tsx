import React from "react";

import { AudioTrackPlayer } from "./internal/AudioTrackPlayer";
import { VideoCommsControls } from "./internal/VideoCommsControls";
import { Participant, VideoSource, VideoTrack } from "./types";
import { VideoTrackDisplay } from "./VideoTrackDisplay";

interface VideoCommsParticipantProps {
  participant: Participant;
  isLocal?: boolean;
  videoTrackControls?: (track: VideoTrack) => JSX.Element;
}

export const VideoCommsParticipant: React.FC<VideoCommsParticipantProps> = ({
  participant,
  isLocal,
  videoTrackControls,
}) => {
  return (
    <>
      {participant.videoTracks.map((track) => (
        <React.Fragment key={track.id}>
          <VideoTrackDisplay
            key={track.id}
            track={track}
            isMirrored={isLocal && track.sourceType === VideoSource.Webcam}
          />
          {videoTrackControls && videoTrackControls(track)}
        </React.Fragment>
      ))}
      {participant.audioTracks.map((track) => (
        <AudioTrackPlayer key={track.id} track={track} />
      ))}
      {isLocal && <VideoCommsControls />}
    </>
  );
};
