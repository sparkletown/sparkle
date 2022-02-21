import React, { ReactNode } from "react";

import { useProfileById } from "hooks/user/useProfileById";

import { UserReactions } from "components/molecules/UserReactions";

import { UserAvatar } from "components/atoms/UserAvatar";

import { AudioTrackPlayer } from "./internal/AudioTrackPlayer";
import { useMute } from "./internal/useMute";
import { VideoCommsControls } from "./internal/VideoCommsControls";
import { useVideoComms } from "./hooks";
import { Participant, VideoSource, VideoTrack } from "./types";
import { VideoTrackDisplay } from "./VideoTrackDisplay";

import styles from "./scss/VideoCommsParticipant.module.scss";

interface VideoCommsParticipantProps {
  participant: Participant;
  isLocal?: boolean;
  reactionPosition?: "left" | "right";
  isAudioEffectDisabled?: boolean;

  /**
   * A function that will generate controls on a per-video-track basis. Useful for
   * adding things like "share" buttons or similar on each track. The Video
   * Huddle components makes use of this.
   */
  videoTrackControls?: (track: VideoTrack) => ReactNode;
}

export const VideoCommsParticipant: React.FC<VideoCommsParticipantProps> = ({
  participant,
  isLocal,
  videoTrackControls,
  reactionPosition = "right",
  isAudioEffectDisabled = true,
}) => {
  const {
    startAudio,
    stopAudio,
    startVideo,
    stopVideo,
    isTransmittingAudio,
    isTransmittingVideo,
  } = useVideoComms();

  const { profile, userId, isLoading } = useProfileById({
    userId: participant.sparkleId,
  });

  const hasActiveVideoStream = participant.videoTracks.some(
    ({ sourceType, enabled }) => sourceType === VideoSource.Webcam && enabled
  );

  // These muted controls are only for muting the playback of remote participants
  // Local participant audio is controlled via useVideoComms
  const { isMuted, mute, unmute } = useMute();

  return (
    <div className={styles.videoCommsParticipant}>
      {hasActiveVideoStream &&
        participant.videoTracks.map((track) => (
          <div key={track.id} className={styles.trackContainer}>
            <VideoTrackDisplay
              key={track.id}
              track={track}
              isMirrored={isLocal && track.sourceType === VideoSource.Webcam}
            />
            <div className={styles.videoCommsControlsContainer}>
              {videoTrackControls && videoTrackControls(track)}
            </div>
          </div>
        ))}
      {!isLocal &&
        participant.audioTracks.map((track) => (
          <AudioTrackPlayer key={track.id} track={track} isMuted={isMuted} />
        ))}

      {!isLoading && (
        <>
          <UserAvatar
            containerClassName={styles.avatarContainer}
            user={profile}
          />
          {userId && (
            <UserReactions
              userId={userId}
              isMuted={isAudioEffectDisabled}
              reactionPosition={reactionPosition}
            />
          )}
        </>
      )}
      <div className={styles.videoCommsControlsContainer}>
        {isLocal ? (
          <VideoCommsControls
            startAudio={startAudio}
            stopAudio={stopAudio}
            startVideo={startVideo}
            stopVideo={stopVideo}
            audioEnabled={isTransmittingAudio}
            videoEnabled={isTransmittingVideo}
          />
        ) : (
          <VideoCommsControls
            startAudio={unmute}
            stopAudio={mute}
            audioEnabled={!isMuted}
          />
        )}
      </div>
    </div>
  );
};
