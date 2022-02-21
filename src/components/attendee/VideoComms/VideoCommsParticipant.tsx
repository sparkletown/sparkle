import React, { useCallback, useMemo } from "react";
import classNames from "classnames";

import { UserId } from "types/id";

import { useProfileById } from "hooks/user/useProfileById";

import { LoadingSpinner } from "components/atoms/LoadingSpinner";
import { UserAvatar } from "components/atoms/UserAvatar";

import { AudioTrackPlayer } from "./internal/AudioTrackPlayer";
import { useMute } from "./internal/useMute";
import { VideoCommsControls } from "./internal/VideoCommsControls";
import { useVideoComms } from "./hooks";
import { Participant, VideoSource } from "./types";
import { VideoTrackDisplay } from "./VideoTrackDisplay";

import styles from "./scss/VideoCommsParticipant.module.scss";

interface VideoCommsParticipantProps {
  participant: Participant;
  isLocal?: boolean;
}

export const VideoCommsParticipant: React.FC<VideoCommsParticipantProps> = ({
  participant,
  isLocal,
}) => {
  const {
    startAudio,
    stopAudio,
    startVideo,
    stopVideo,
    isTransmittingAudio,
    isTransmittingVideo,
    stopShareScreen,
  } = useVideoComms();

  const { profile, isLoading } = useProfileById({
    userId: participant.sparkleId as UserId,
  });

  const determineControlsClassnames = useCallback(
    (isEnabled) =>
      classNames(styles.videoCommsControlsContainer, {
        [styles.videoCommsControlsContainer__darkButtons]: !isEnabled,
      }),
    []
  );

  // These muted controls are only for muting the playback of remote participants
  // Local participant audio is controlled via useVideoComms
  const { isMuted, mute, unmute } = useMute();

  // We currently only allow one audio track and two video tracks (webcam
  // and screenshare). The controls available on each are different. Rather than
  // building a complex loop with lots of logic, the tracks are picked out and
  // the logic simplified.
  const webcamTrack = useMemo(
    () =>
      participant.videoTracks.find(
        ({ sourceType }) => sourceType === VideoSource.Webcam
      ),
    [participant.videoTracks]
  );
  const screenshareTrack = useMemo(
    () =>
      participant.videoTracks.find(
        ({ sourceType }) => sourceType === VideoSource.Screenshare
      ),
    [participant.videoTracks]
  );
  const audioStream = participant.audioTracks[0];

  if (isLoading) {
    return <LoadingSpinner />;
  }
  return (
    <div className={styles.videoCommsParticipant}>
      <div className={styles.trackContainer}>
        {webcamTrack?.enabled ? (
          <VideoTrackDisplay track={webcamTrack} isMirrored={isLocal} />
        ) : (
          <>
            <UserAvatar
              containerClassName={styles.avatarContainer}
              user={profile}
            />
            <span className={styles.userName}>{profile?.partyName}</span>
          </>
        )}
        <div className={determineControlsClassnames(webcamTrack?.enabled)}>
          {isLocal ? (
            <>
              <VideoCommsControls
                startAudio={startAudio}
                stopAudio={stopAudio}
                startVideo={startVideo}
                stopVideo={stopVideo}
                audioEnabled={isTransmittingAudio}
                videoEnabled={isTransmittingVideo}
                sourceType={VideoSource.Webcam}
              />
            </>
          ) : (
            <VideoCommsControls
              startAudio={unmute}
              stopAudio={mute}
              audioEnabled={!isMuted}
              sourceType={VideoSource.Webcam}
            />
          )}
        </div>
      </div>
      {screenshareTrack?.enabled && (
        <div className={styles.trackContainer}>
          <VideoTrackDisplay track={screenshareTrack} />
          {isLocal && (
            <div className={determineControlsClassnames(true)}>
              <VideoCommsControls
                stopVideo={stopShareScreen}
                videoEnabled={true}
                sourceType={VideoSource.Screenshare}
              />
            </div>
          )}
        </div>
      )}

      {!isLocal && <AudioTrackPlayer track={audioStream} isMuted={isMuted} />}
    </div>
  );
};
