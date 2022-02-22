import React, { useMemo } from "react";
import { VideoCommsParticipant } from "components/attendee/VideoComms/VideoCommsParticipant";
import styled, { css } from "styled-components";

import { AnyVenue } from "types/venues";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";
import { WithId } from "utils/id";

import { useVideoRoomState } from "hooks/twilio/useVideoRoomState";
import { useUser } from "hooks/useUser";

import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";

const StyledWrapper = styled.div`
  display: grid;
  width: 60%;
  margin: 6rem auto;
  grid-template-columns: repeat(4, 1fr);
  grid-gap: 1rem;
`;

const StyledBarrel = styled.iframe.attrs({
  title: "FireBarrelVideo",
  frameBorder: "0",
  allow:
    "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
})`
  width: 100%;
  height: 100%;
  grid-column: 2 / span 2;
  grid-row: 1 / span 2;
  align-self: center;
  justify-self: center;

  border-radius: 28px;
`;

const emptyChair = css`
  &:after {
    content: "+";
    font-size: 2rem;
  }
`;

const filledChair = css`
  background-color: unset;
`;

const StyledChair = styled.div<{
  isEmpty?: boolean;
}>`
  display: flex;
  justify-content: center;
  align-items: center;

  position: relative;

  border-radius: 28px;

  background-color: #1a1d24;

  overflow: hidden;

  ${({ isEmpty }) => (isEmpty ? emptyChair : filledChair)};

  &:before {
    content: "";
    display: inline-block;
    width: 1px;
    height: 0;
    padding-bottom: calc(100% / (1 / 1));
  }

  .col {
    width: 100%;
    height: 100%;
    padding: 0;
  }

  .av-controls {
    display: flex;
    justify-content: space-around;
    margin: 4px;

    position: absolute;
    right: 0;
    bottom: 1em;
    left: 0;

    text-align: center;
  }
`;

const DEFAULT_BURN_BARREL_SEATS = 8;

export interface FireBarrelProps {
  venue: WithId<AnyVenue>;
}

export const FireBarrel: React.FC<FireBarrelProps> = ({ venue }) => {
  const { userId, userWithId } = useUser();

  const {
    localParticipant,
    participants,
    renderErrorModal,
  } = useVideoRoomState(userId, venue?.id);

  const seatCount =
    participants.length > DEFAULT_BURN_BARREL_SEATS
      ? participants.length
      : DEFAULT_BURN_BARREL_SEATS;

  const seatsArray = useMemo(() => Array.from(Array(seatCount)), [seatCount]);

  if (!userWithId) return <LoadingPage />;

  return (
    <StyledWrapper>
      <StyledBarrel
        src={convertToEmbeddableUrl({
          url: venue?.iframeUrl,
          autoPlay: true,
        })}
      />
      {seatsArray.map((_, index) => {
        const { participant, user: participantUserData } =
          participants?.[index] ?? {};

        if (!participantUserData) {
          return <StyledChair key={index} isEmpty />;
        }

        const isMe = participantUserData.id === userId;

        if (!!localParticipant && isMe) {
          return (
            <StyledChair key={userId}>
              <VideoCommsParticipant participant={localParticipant} isLocal />
            </StyledChair>
          );
        }

        if (participants.length && !!participants[index]) {
          return (
            <StyledChair key={participant.sparkleId}>
              <VideoCommsParticipant participant={participant} />
            </StyledChair>
          );
        }

        return <React.Fragment key={index} />;
      })}

      {renderErrorModal()}
    </StyledWrapper>
  );
};
