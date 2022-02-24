import React, { useMemo } from "react";

import { AnyVenue } from "types/venues";

import { convertToEmbeddableUrl } from "utils/embeddableUrl";
import { WithId } from "utils/id";

import { useVideoRoomState } from "hooks/twilio/useVideoRoomState";
import { useUser } from "hooks/useUser";

import { VideoCommsParticipant } from "components/attendee/VideoComms/VideoCommsParticipant";
import { LoadingPage } from "components/molecules/LoadingPage/LoadingPage";

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
    <div>
      <iframe
        src={convertToEmbeddableUrl({
          url: venue?.iframeUrl,
          autoPlay: true,
        })}
        title="FireBarrelVideo"
        frameBorder="0"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
      />
      {seatsArray.map((_, index) => {
        const { participant, user: participantUserData } =
          participants?.[index] ?? {};

        if (!participantUserData) {
          return <div key={index} />;
        }

        const isMe = participantUserData.id === userId;

        if (!!localParticipant && isMe) {
          return (
            <div key={userId}>
              <VideoCommsParticipant participant={localParticipant} isLocal />
            </div>
          );
        }

        if (participants.length && !!participants[index]) {
          return (
            <div key={participant.sparkleId}>
              <VideoCommsParticipant participant={participant} />
            </div>
          );
        }

        return <React.Fragment key={index} />;
      })}

      {renderErrorModal()}
    </div>
  );
};
