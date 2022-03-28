import React, { useCallback, useEffect, useMemo, useState } from "react";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useVideoComms } from "components/attendee/VideoComms/hooks";
import { VideoCommsParticipant } from "components/attendee/VideoComms/VideoCommsParticipant";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useUserId } from "hooks/user/useUserId";

import styles from "./WebcamGrid.module.scss";

interface TableGridProps {
  space: WithId<AnyVenue>;
}

export const WebcamGrid: React.FC<TableGridProps> = ({ space }) => {
  const { userId } = useUserId();
  const [hasJoined, setHasJoined] = useState(false);
  const {
    joinChannel,
    localParticipant,
    remoteParticipants,
    disconnect,
    startVideo,
    startAudio,
    stopVideo,
    stopAudio,
  } = useVideoComms();

  useEffect(() => {
    // Only connect once the user ID is set (loaded)
    if (userId) {
      joinChannel({
        userId,
        channelId: `webcamgrid-${space.id}`,
        enableAudio: false,
        enableVideo: false,
      });
      return () => {
        disconnect();
      };
    }
  }, [disconnect, joinChannel, space.id, userId]);

  const meComponent = useMemo(
    () =>
      hasJoined &&
      localParticipant && (
        <div key={localParticipant.sparkleId}>
          <div className={styles.participant}>
            <VideoCommsParticipant participant={localParticipant} isLocal />
          </div>
        </div>
      ),
    [hasJoined, localParticipant]
  );

  const othersComponents = useMemo(
    () =>
      remoteParticipants.map((participant) => {
        if (!participant) {
          return null;
        }

        return (
          <div key={participant.sparkleId}>
            <div className={styles.participant}>
              <VideoCommsParticipant participant={participant} />
            </div>
          </div>
        );
      }),
    [remoteParticipants]
  );

  const joinVideo = useCallback(() => {
    startVideo();
    startAudio();
    setHasJoined(true);
  }, [startAudio, startVideo]);

  const leaveVideo = useCallback(() => {
    stopVideo();
    stopAudio();
    setHasJoined(false);
  }, [stopAudio, stopVideo]);

  return (
    <div className={styles.container}>
      <div className={styles.WebcamGrid}>
        {meComponent}
        {othersComponents}
        {hasJoined ? (
          <div className={styles.leaveButton} onClick={leaveVideo}>
            Leave <FontAwesomeIcon icon={faTimesCircle} />
          </div>
        ) : (
          <div className={styles.joinButton} onClick={joinVideo}>
            Join
          </div>
        )}
      </div>
    </div>
  );
};
