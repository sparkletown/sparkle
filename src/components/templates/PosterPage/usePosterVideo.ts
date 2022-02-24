import { useMemo } from "react";

import { ParticipantWithUser } from "types/rooms";
import { User } from "types/User";

import { WithId } from "utils/id";

import { useVideoRoomState } from "hooks/twilio/useVideoRoomState";
import { useUser } from "hooks/useUser";

import { Participant } from "components/attendee/VideoComms/types";

export const usePosterVideo = (venueId: string) => {
  const { userId, userWithId } = useUser();

  const {
    participants,
    localParticipant,
    becomeActiveParticipant,
    becomePassiveParticipant,
  } = useVideoRoomState(userId, venueId, false);

  const localParticipantWithUser:
    | ParticipantWithUser<Participant>
    | undefined = useMemo(
    () =>
      localParticipant && userWithId
        ? { participant: localParticipant, user: userWithId }
        : undefined,
    [localParticipant, userWithId]
  );

  const allParticipants = useMemo(
    () =>
      localParticipantWithUser
        ? [localParticipantWithUser, ...participants]
        : participants,
    [localParticipantWithUser, participants]
  );

  const { passiveListeners, activeParticipants } = useMemo(
    () =>
      allParticipants.reduce<{
        passiveListeners: WithId<User>[];
        activeParticipants: {
          participant: Participant;
          user: WithId<User>;
        }[];
      }>(
        (acc, { participant, user }) => {
          if (!user) return acc;

          // If participant is not broadcasting video, put them into passiveListeners
          if (participant.videoTracks.length === 0) {
            return {
              ...acc,
              passiveListeners: [...acc.passiveListeners, user],
            };
          }

          return {
            ...acc,
            activeParticipants: [
              ...acc.activeParticipants,
              { participant, user },
            ],
          };
        },
        {
          passiveListeners: [],
          activeParticipants: [],
        }
      ),
    [allParticipants]
  );

  const isMeActiveParticipant = useMemo(
    () =>
      !!activeParticipants.find(
        (activeParticipant) =>
          activeParticipant.participant.sparkleId === userId
      ),
    [activeParticipants, userId]
  );

  return {
    activeParticipants,
    passiveListeners,

    isMeActiveParticipant,

    becomeActiveParticipant,
    becomePassiveParticipant,
    localParticipant,
  };
};
