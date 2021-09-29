import React, { useCallback, useMemo } from "react";

import { unsetTableSeat } from "api/venue";

import { useVideoRoomState } from "hooks/twilio/useVideoRoomState";
import { useUser } from "hooks/useUser";

import { LocalParticipant } from "components/organisms/Room/LocalParticipant";
import { Participant } from "components/organisms/Room/Participant";
import VideoErrorModal from "components/organisms/Room/VideoErrorModal";

import { Loading } from "components/molecules/Loading";

import "./JazzBarRoom.scss";

const NUM_OF_SIDED_USERS_MINUS_ONE = 3;

interface RoomProps {
  roomName: string;
  venueId: string;
  setSeatedAtTable?: (val: string) => void;
  onBack?: () => void;
  defaultMute?: boolean;
  isAudioEffectDisabled: boolean;
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
  isAudioEffectDisabled,
}) => {
  const { userId, profile, userWithId } = useUser();

  const {
    localParticipant,
    participants,
    videoError,
    dismissVideoError,
    retryConnect,
    loading,
  } = useVideoRoomState(userWithId, roomName);

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
        <div className="jazzbar-room__participant">
          <LocalParticipant
            key={localParticipant.sid}
            participant={localParticipant}
            profileData={profile}
            profileDataId={localParticipant.identity}
            defaultMute={defaultMute}
            isAudioEffectDisabled={isAudioEffectDisabled}
          />
        </div>
      )}
      {sidedVideoParticipants.map((participant) => (
        <div
          key={participant.participant.identity}
          className="jazzbar-room__participant"
        >
          <Participant
            participant={participant.participant}
            profileData={participant.user}
            profileDataId={participant.user.id}
          />
        </div>
      ))}
      <div className="jazzbar-room__participants">
        {otherVideoParticipants.map((participant) => (
          <div
            key={participant.participant.identity}
            className="jazzbar-room__participant"
          >
            <Participant
              participant={participant.participant}
              profileData={participant.user}
              profileDataId={participant.user.id}
            />
          </div>
        ))}
      </div>

      <VideoErrorModal
        show={!!videoError}
        onHide={dismissVideoError}
        errorMessage={videoError}
        onRetry={retryConnect}
        onBack={() => (setSeatedAtTable ? leaveSeat() : dismissVideoError())}
      />
    </>
  );
};
