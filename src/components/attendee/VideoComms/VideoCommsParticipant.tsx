import React from "react";

import { AudioTrackPlayer } from "./internal/AudioTrackPlayer";
import { VideoCommsControls } from "./internal/VideoCommsControls";
import { Participant, VideoSource, VideoTrack } from "./types";
import { VideoTrackDisplay } from "./VideoTrackDisplay";

import styles from "./scss/VideoCommsParticipant.module.scss";

interface VideoCommsParticipantProps {
  participant: Participant;
  isLocal?: boolean;
  /**
   * A function that will generate controls on a per-video-track basis. Useful for
   * adding things like "share" buttons or similar on each track. The Video
   * Huddle components makes use of this.
   */
  videoTrackControls?: (track: VideoTrack) => JSX.Element;
}

export const VideoCommsParticipant: React.FC<VideoCommsParticipantProps> = ({
  participant,
  isLocal,
  videoTrackControls,
}) => {
  return (
    <div className={styles.videoCommsParticipant}>
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
    </div>
  );
};
