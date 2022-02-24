import React, { Fragment, useCallback, useMemo } from "react";

import { unsetTableSeat } from "api/venue";

import { useVideoRoomState } from "hooks/twilio/useVideoRoomState";
import { useUser } from "hooks/useUser";

import { VideoCommsParticipant } from "components/attendee/VideoComms/VideoCommsParticipant";
import { Loading } from "components/molecules/Loading";

import "./Room.scss";

interface RoomProps {
  roomName: string;
  venueId: string;
  setSeatedAtTable?: (val: string) => void;
  hasChairs?: boolean;
  defaultMute?: boolean;
}

export const Room: React.FC<RoomProps> = ({
  roomName,
  venueId,
  setSeatedAtTable,
  hasChairs = true,
  defaultMute,
}) => {
  const { userId, userWithId } = useUser();

  const {
    localParticipant,
    participants,
    renderErrorModal,
    loading,
  } = useVideoRoomState(userId, roomName);

  const leaveSeat = useCallback(async () => {
    if (!userId || !venueId) return;

    await unsetTableSeat(userId, { venueId });

    setSeatedAtTable?.("");
  }, [setSeatedAtTable, userId, venueId]);

  // Video stream and local participant take up 2 slots
  // Ensure capacity is always even, so the grid works

  const participantContainerClassName = useMemo(() => {
    const attendeeCount = (participants.length ?? 0) + 1; // Include yourself
    if (attendeeCount <= 4) {
      return "two-across";
    }
    return "three-across";
  }, [participants.length]);

  const meComponent = useMemo(
    () =>
      localParticipant &&
      userWithId && (
        <div
          className={`participant-container ${participantContainerClassName}`}
          key={localParticipant.sparkleId}
        >
          <VideoCommsParticipant participant={localParticipant} isLocal />
        </div>
      ),
    [localParticipant, userWithId, participantContainerClassName]
  );

  const othersComponents = useMemo(
    () =>
      participants.map((participant) => {
        if (!participant) {
          return null;
        }

        return (
          <div
            key={participant.participant.sparkleId}
            className={`participant-container ${participantContainerClassName}`}
          >
            <VideoCommsParticipant participant={participant.participant} />
          </div>
        );
      }),
    [participants, participantContainerClassName]
  );

  const emptyComponents = useMemo(
    () =>
      hasChairs
        ? Array(participants.length % 2).map((e, index) => (
            <div
              key={`empty-participant-${index}`}
              className={`participant-container ${participantContainerClassName}`}
            >
              <img
                className="empty-chair-image"
                src="/empty-chair.png"
                alt="empty chair"
              />
            </div>
          ))
        : [],
    [hasChairs, participants.length, participantContainerClassName]
  );

  if (loading) {
    return <Loading />;
  }

  return (
    <Fragment>
      {meComponent}
      {othersComponents}
      {emptyComponents}
      {renderErrorModal(leaveSeat)}
    </Fragment>
  );
};
