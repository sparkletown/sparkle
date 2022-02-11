import React from "react";
import classNames from "classnames";

import { UserId } from "types/id";

import { useProfileById } from "hooks/user/useProfileById";

import { UserAvatar } from "components/atoms/UserAvatar";

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
  const { profile, isLoading } = useProfileById({
    userId: participant.sparkleId as UserId,
  });

  const hasActiveVideoStream = participant.videoTracks.some(
    (t) => t.sourceType === VideoSource.Webcam && t.enabled
  );

  const invertedControlsClassnames = classNames(
    styles.videoCommsControlsContainer,
    styles.videoCommsControlsContainer__darkButtons
  );

  return (
    <div className={styles.videoCommsParticipant}>
      {participant.videoTracks.map((track) => (
        <div key={track.id} className={styles.trackContainer}>
          <VideoTrackDisplay
            key={track.id}
            track={track}
            isMirrored={isLocal && track.sourceType === VideoSource.Webcam}
          />
          <div className={styles.videoCommsControlsContainer}>
            {isLocal && <VideoCommsControls />}
            {videoTrackControls && videoTrackControls(track)}
          </div>
        </div>
      ))}
      {participant.audioTracks.map((track) => (
        <AudioTrackPlayer key={track.id} track={track} />
      ))}

      {!hasActiveVideoStream && !isLoading && (
        <>
          <UserAvatar
            containerClassName={styles.avatarContainer}
            user={profile}
          />
          <div className={invertedControlsClassnames}>
            {isLocal && <VideoCommsControls />}
          </div>
        </>
      )}
    </div>
  );
};
