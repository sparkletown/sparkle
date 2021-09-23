import React, { useMemo, useState } from "react";

import { AnyVenue } from "types/venues";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";
import { WithId } from "utils/id";

import { useVideoRoomState } from "hooks/twilio";
import { useRecentVenueUsers } from "hooks/users";
import { useUser } from "hooks/useUser";

import { LocalParticipant } from "components/organisms/Room/LocalParticipant";
import VideoErrorModal from "components/organisms/Room/VideoErrorModal";

import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";

import * as S from "./FireBarrel.styled";

const DEFAULT_BURN_BARREL_SEATS = 8;

export interface FireBarrelProps {
  venue: WithId<AnyVenue>;
}

export const FireBarrel: React.FC<FireBarrelProps> = ({ venue }) => {
  // @debt should be replaced with a subcollection
  const { recentVenueUsers, isRecentVenueUsersLoaded } = useRecentVenueUsers({
    venueId: venue?.id,
  });

  const recentUserCount = venue?.recentUserCount ?? 0;

  const seatCount =
    recentUserCount > DEFAULT_BURN_BARREL_SEATS
      ? recentUserCount
      : DEFAULT_BURN_BARREL_SEATS;

  const seatsArray = useMemo(() => Array.from(Array(seatCount)), [seatCount]);
  const { userId, userWithId } = useUser();

  const { room, participants } = useVideoRoomState({
    user: userWithId,
    roomName: venue?.name,
  });

  const [videoError, setVideoError] = useState<string>("");

  return useMemo(() => {
    if (!isRecentVenueUsersLoaded || !userWithId) return <LoadingPage />;

    return (
      <S.Wrapper>
        <S.Barrel
          src={convertToEmbeddableUrl({
            url: venue?.iframeUrl,
            autoPlay: true,
          })}
        />

        {/* @debt Refactor this to be less brittle/complex */}
        {/* @debt should be replaced with a subcollection */}
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
            const { participant, user: participantUserData } = participants[
              index
            ];

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
    videoError,
    venue,
    isRecentVenueUsersLoaded,
  ]);
};
