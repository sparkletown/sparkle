import React, { Fragment, useCallback, useMemo } from "react";

import { unsetTableSeat } from "api/venue";

import { useVideoRoomState } from "hooks/twilio/useVideoRoomState";
import { useUser } from "hooks/useUser";

import { Loading } from "components/molecules/Loading";

import { LocalParticipant } from "./LocalParticipant";
import { Participant } from "./Participant";

import "./Room.scss";

interface RoomProps {
  roomName: string;
  venueId: string;
  setSeatedAtTable?: (val: string) => void;
  onBack?: () => void;
  hasChairs?: boolean;
  defaultMute?: boolean;
}

const Room: React.FC<RoomProps> = ({
  roomName,
  venueId,
  setSeatedAtTable,
  hasChairs = true,
  defaultMute,
}) => {
  const { userId, profile } = useUser();

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

  const meComponent = useMemo(() => {
    return localParticipant && profile ? (
      <div className={`participant-container ${participantContainerClassName}`}>
        <LocalParticipant
          key={localParticipant.sid}
          participant={localParticipant}
          profileData={profile}
          profileDataId={localParticipant.identity}
          defaultMute={defaultMute}
        />
      </div>
    ) : null;
  }, [localParticipant, profile, defaultMute, participantContainerClassName]);

  const othersComponents = useMemo(
    () =>
      participants.map((participant) => {
        if (!participant) {
          return null;
        }

        return (
          <div
            key={participant.participant.identity}
            className={`participant-container ${participantContainerClassName}`}
          >
            <Participant
              participant={participant.participant}
              profileData={participant.user}
              profileDataId={participant.user.id}
            />
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
      {renderErrorModal((dismissVideoError: () => void) =>
        setSeatedAtTable ? leaveSeat() : dismissVideoError
      )}
    </Fragment>
  );
};

export default Room;
