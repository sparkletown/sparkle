import React, { useMemo } from "react";

import { AnyVenue } from "types/venues";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";
import { WithId } from "utils/id";

import { useVideoRoomState } from "hooks/twilio/useVideoRoomState";
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
  const { userId, userWithId } = useUser();

  const {
    room,
    participants,
    videoError,
    dismissVideoError,
    retryConnect,
  } = useVideoRoomState(userWithId, venue?.name);

  const seatCount =
    participants.length > DEFAULT_BURN_BARREL_SEATS
      ? participants.length
      : DEFAULT_BURN_BARREL_SEATS;

  const seatsArray = useMemo(() => Array.from(Array(seatCount)), [seatCount]);

  if (!userWithId) return <LoadingPage />;

  return (
    <S.Wrapper>
      <S.Barrel
        src={convertToEmbeddableUrl({
          url: venue?.iframeUrl,
          autoPlay: true,
        })}
      />
      {seatsArray.map((_, index) => {
        const { participant, user: participantUserData } =
          participants?.[index] ?? {};

        if (!participantUserData) {
          return <S.Chair key={index} isEmpty />;
        }

        const isMe = participantUserData.id === userId;

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
        onHide={dismissVideoError}
        errorMessage={videoError}
        onRetry={retryConnect}
        onBack={dismissVideoError}
      />
    </S.Wrapper>
  );
};
