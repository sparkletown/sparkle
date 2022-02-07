import React, { useCallback, useEffect, useMemo } from "react";
import { useVideoHuddle } from "components/attendee/VideoHuddle/useVideoHuddle";

import { unsetTableSeat } from "api/venue";

import { useVideoRoomState } from "hooks/twilio/useVideoRoomState";
import { useUser } from "hooks/useUser";

import { VideoParticipant } from "components/organisms/Video";

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
  defaultMute,
  isReactionsMuted,
}) => {
  const { userId, profile, userWithId } = useUser();

  const { localParticipant, participants, renderErrorModal, loading } =
    useVideoRoomState(userId, roomName);

  const { joinHuddle, leaveHuddle } = useVideoHuddle();

  const leaveSeat = useCallback(async () => {
    if (!userId || !venueId) return;

    await unsetTableSeat(userId, { venueId });

    setSeatedAtTable?.("");
  }, [setSeatedAtTable, userId, venueId]);

  useEffect(() => {
    joinHuddle(userId || '', `${venueId}-${roomName}`);
    return () => {
      leaveHuddle();
    };
  }, [joinHuddle, leaveHuddle, roomName]);

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
        <div className="jazzbar-room__participant" key={localParticipant.sid}>
          <VideoParticipant
            participant={localParticipant}
            participantUser={userWithId}
            defaultMute={defaultMute}
            isAudioEffectDisabled={isReactionsMuted}
          />
        </div>
      )}
      {sidedVideoParticipants.map((participant) => (
        <div
          key={participant.participant.identity}
          className="jazzbar-room__participant"
        >
          <VideoParticipant
            participant={participant.participant}
            participantUser={participant.user}
            isAudioEffectDisabled={isReactionsMuted}
          />
        </div>
      ))}
      <div className="jazzbar-room__participants">
        {otherVideoParticipants.map((participant) => (
          <div
            key={participant.participant.identity}
            className="jazzbar-room__participant"
          >
            <VideoParticipant
              participant={participant.participant}
              participantUser={participant.user}
              isAudioEffectDisabled={isReactionsMuted}
            />
          </div>
        ))}
      </div>

      {renderErrorModal(leaveSeat)}
    </>
  );
};
