import React, { useCallback, useEffect, useMemo, useState } from "react";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useVideoComms } from "components/attendee/VideoComms/hooks";
import { VideoCommsParticipant } from "components/attendee/VideoComms/VideoCommsParticipant";

import { SpaceWithId } from "types/id";

import { useUserId } from "hooks/user/useUserId";

import styles from "./WebcamGrid.module.scss";

interface TableGridProps {
  space: SpaceWithId;
}

export const WebcamGrid: React.FC<TableGridProps> = ({ space }) => {
  const { userId } = useUserId();
  const [hasJoined, setHasJoined] = useState(false);
  const {
    joinChannel,
    localParticipant,
    remoteParticipants,
    disconnect,
  } = useVideoComms();

  useEffect(() => {
    return () => {
      if (hasJoined) {
        disconnect();
      }
    };
  }, [disconnect, hasJoined]);

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
    joinChannel({
      userId,
      channelId: `webcamgrid-${space.id}`,
      enableAudio: true,
      enableVideo: true,
    });
    setHasJoined(true);
  }, [joinChannel, space.id, userId]);

  const leaveVideo = useCallback(() => {
    disconnect();
    setHasJoined(false);
  }, [disconnect]);

  return (
    <div
      data-bem="WebcamGrid"
      data-block="WebcamGrid"
      data-side="att"
      className={styles.container}
    >
      <div className={styles.webcamContainer}>
        {hasJoined && (
          <div className={styles.leaveContainer}>
            <div className={styles.leaveButton} onClick={leaveVideo}>
              Leave <FontAwesomeIcon icon={faTimesCircle} />
            </div>
          </div>
        )}
        <div className={styles.WebcamGrid}>
          {meComponent}
          {othersComponents}
          {!hasJoined && (
            <div className={styles.joinButton} onClick={joinVideo}>
              Join with video
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
