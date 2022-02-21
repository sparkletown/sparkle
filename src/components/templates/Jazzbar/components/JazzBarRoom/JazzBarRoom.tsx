import React, { useCallback, useMemo } from "react";
import { VideoCommsParticipant } from "components/attendee/VideoComms/VideoCommsParticipant";

import { unsetTableSeat } from "api/venue";

import { useVideoRoomState } from "hooks/twilio/useVideoRoomState";
import { useUser } from "hooks/useUser";

import { Loading } from "components/molecules/Loading";

import "./JazzBarRoom.scss";

const NUM_OF_SIDED_USERS_MINUS_ONE = 3;

interface RoomProps {
  roomName: string;
  venueId: string;
  setSeatedAtTable?: (val: string) => void;
  defaultMute?: boolean;
  isReactionsMuted: boolean;
}

// @debt THIS COMPONENT IS THE COPY OF components/molecules/Room
// The reason to copy it was the lack of time to refactor the whole thing, so the
// safest approch (not to break other Venues that rely on TableComponent) is to copy this component
// It needs to get deleted in the future
export const JazzBarRoom: React.FC<RoomProps> = ({
  roomName,
  venueId,
  setSeatedAtTable,
  isReactionsMuted,
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

  const [sidedVideoParticipants, otherVideoParticipants] = useMemo(() => {
    const sidedVideoParticipants = participants
      .slice(0, NUM_OF_SIDED_USERS_MINUS_ONE)
      .filter((p) => !!p);

    const otherVideoParticipants = participants
      .slice(NUM_OF_SIDED_USERS_MINUS_ONE)
      .filter((p) => !!p);

    return [sidedVideoParticipants, otherVideoParticipants];
  }, [participants]);

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      {localParticipant && profile && (
        <div
          className="jazzbar-room__participant"
          key={localParticipant.sparkleId}
        >
          <VideoCommsParticipant
            participant={localParticipant}
            isLocal
            isAudioEffectDisabled={isReactionsMuted}
          />
        </div>
      )}
      {sidedVideoParticipants.map((participant) => (
        <div
          key={participant.participant.sparkleId}
          className="jazzbar-room__participant"
        >
          <VideoCommsParticipant
            participant={participant.participant}
            reactionPosition="left"
            isAudioEffectDisabled={isReactionsMuted}
          />
        </div>
      ))}
      <div className="jazzbar-room__participants">
        {otherVideoParticipants.map((participant) => (
          <div
            key={participant.participant.sparkleId}
            className="jazzbar-room__participant"
          >
            <VideoCommsParticipant
              participant={participant.participant}
              isAudioEffectDisabled={isReactionsMuted}
            />
          </div>
        ))}
      </div>

      {renderErrorModal(leaveSeat)}
    </>
  );
};
