import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAsyncFn, useInterval } from "react-use";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useVideoComms } from "components/attendee/VideoComms/hooks";
import { VideoCommsParticipant } from "components/attendee/VideoComms/VideoCommsParticipant";

import { getTwilioRoomParticipants } from "api/video";

import { UserId } from "types/id";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useUserId } from "hooks/user/useUserId";

import { WebcamGridAvatar } from "./WebcamGridAvatar";

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
  } = useVideoComms();

  const twilioRoomName = useMemo(() => `webcamgrid-${space.id}`, [space.id]);

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

  const [{ value }, getRoomParticipants] = useAsyncFn(
    async () => await getTwilioRoomParticipants(twilioRoomName),
    [twilioRoomName]
  );

  useInterval(async () => await getRoomParticipants(), 10000);

  const participantsIds = useMemo(() => value?.data, [value?.data]);

  const joinVideo = useCallback(() => {
    joinChannel({
      userId,
      channelId: twilioRoomName,
      enableAudio: false,
      enableVideo: false,
    });
    setHasJoined(true);
  }, [joinChannel, twilioRoomName, userId]);

  const leaveVideo = useCallback(() => {
    disconnect();
    setHasJoined(false);
  }, [disconnect]);

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
          <>
            <div className={styles.joinButton} onClick={joinVideo}>
              Join
            </div>
            <div>
              {participantsIds?.map((participantId) => (
                <WebcamGridAvatar
                  key={participantId}
                  userId={participantId as UserId}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
