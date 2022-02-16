import React, { ReactNode } from "react";
import classNames from "classnames";

import { UserId } from "types/id";

import { useProfileById } from "hooks/user/useProfileById";

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
}) => {
  const {
    startAudio,
    stopAudio,
    startVideo,
    stopVideo,
    isTransmittingAudio,
    isTransmittingVideo,
  } = useVideoComms();

  const { profile, isLoading } = useProfileById({
    userId: participant.sparkleId as UserId,
  });

  const hasActiveVideoStream = participant.videoTracks.some(
    ({ sourceType, enabled }) => sourceType === VideoSource.Webcam && enabled
  );

  const invertedControlsClassnames = classNames(
    styles.videoCommsControlsContainer,
    styles.videoCommsControlsContainer__darkButtons
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

      {!hasActiveVideoStream && !isLoading && (
        <UserAvatar
          containerClassName={styles.avatarContainer}
          user={profile}
        />
      )}
      <div className={invertedControlsClassnames}>
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
