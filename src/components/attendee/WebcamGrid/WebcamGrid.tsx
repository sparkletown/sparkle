import React, { useCallback, useEffect, useMemo, useState } from "react";
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
      enableAudio: false,
      enableVideo: false,
    });
    setHasJoined(true);
  }, [joinChannel, space.id, userId]);

  useEffect(() => {
    joinVideo();

    return () => {
      if (hasJoined) {
        disconnect();
      }
    };
  }, [userId, space.id, joinVideo, hasJoined, disconnect]);

  return (
    <div
      data-bem="WebcamGrid"
      data-block="WebcamGrid"
      data-side="att"
      className={styles.container}
    >
      <div className={styles.WebcamGrid}>
        {meComponent}
        {othersComponents}
      </div>
    </div>
  );
};
