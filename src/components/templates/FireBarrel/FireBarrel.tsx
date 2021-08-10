import React, { useMemo, useState } from "react";

import { ConvertToEmbeddableUrl } from "utils/ConvertToEmbeddableUrl";
import { currentVenueSelector } from "utils/selectors";

import { useVideoRoomState } from "hooks/twilio";
import { useRecentVenueUsers, useWorldUsersById } from "hooks/users";
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

import LocalParticipant from "components/organisms/Room/LocalParticipant";
import VideoErrorModal from "components/organisms/Room/VideoErrorModal";

import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";

import * as S from "./FireBarrel.styled";

const DEFAULT_BURN_BARREL_SEATS = 8;

// @debt refactor this to pass in venue as a prop
export const FireBarrel: React.FC = () => {
  const venue = useSelector(currentVenueSelector);
  const { recentVenueUsers, isRecentVenueUsersLoaded } = useRecentVenueUsers({
    venueName: venue?.name,
  });

  const seatCount =
    recentVenueUsers?.length > DEFAULT_BURN_BARREL_SEATS
      ? recentVenueUsers.length
      : DEFAULT_BURN_BARREL_SEATS;

  const seatsArray = useMemo(() => Array.from(Array(seatCount)), [seatCount]);
  const { userId, userWithId } = useUser();

  const { room, participants } = useVideoRoomState({
    userId,
    roomName: venue?.name,
  });

  const [videoError, setVideoError] = useState<string>("");
  const { worldUsersById } = useWorldUsersById();

  return useMemo(() => {
    if (!isRecentVenueUsersLoaded || !userWithId) return <LoadingPage />;

    return (
      <S.Wrapper>
        <S.Barrel src={ConvertToEmbeddableUrl(venue?.iframeUrl)} />

        {/* @debt Refactor this to be less brittle/complex */}
        {seatsArray.map((_, index) => {
          const partyPerson = recentVenueUsers[index] ?? null;

          const isMe = partyPerson?.id === userId;

          if (!recentVenueUsers[index]) {
            return <S.Chair key={index} isEmpty />;
          }

          if (!!room && isMe) {
            return (
              <S.Chair key={userId}>
                <LocalParticipant
                  participant={room.localParticipant}
                  profileData={userWithId}
                  profileDataId={userWithId?.id}
                />
              </S.Chair>
            );
          }

          if (participants.length && !!participants[index]) {
            const participant = participants[index];
            const participantUserData = worldUsersById[
              participant.identity
            ] && {
              ...worldUsersById[participant.identity],
              id: participant.identity,
            };

            return (
              <S.Chair key={participant.identity}>
                <LocalParticipant
                  participant={participant}
                  profileData={participantUserData}
                  profileDataId={participantUserData.id}
                />
              </S.Chair>
            );
          }

          return <React.Fragment key={index} />;
        })}

        <VideoErrorModal
          show={!!videoError}
          onHide={() => setVideoError("")}
          errorMessage={videoError}
          onRetry={() => {}}
          onBack={() => {}}
        />
      </S.Wrapper>
    );
  }, [
    seatsArray,
    recentVenueUsers,
    userWithId,
    participants,
    room,
    userId,
    worldUsersById,
    videoError,
    venue,
    isRecentVenueUsersLoaded,
  ]);
};
