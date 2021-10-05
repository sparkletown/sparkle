import { useMemo } from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useVideoRoomState } from "hooks/twilio";
import { useUser } from "hooks/useUser";

export const usePosterVideo = (venueId: string) => {
  const { userId, userWithId } = useUser();

  const {
    participants,
    becomeActiveParticipant,
    becomePassiveParticipant,
  } = useVideoRoomState({
    user: userWithId,
    roomName: venueId,
    activeParticipantByDefault: false,
  });

  const { passiveListeners, activeParticipants } = useMemo(
    () =>
      participants.reduce<{
        passiveListeners: WithId<User>[];
        activeParticipants: {
          participant: RemoteParticipant | LocalParticipant;
          user: WithId<User>;
        }[];
      }>(
        (acc, { participant, user }) => {
          if (!user) return acc;

          // If participant is not broadcasting video, put them into passiveListeners
          if (participant.videoTracks.size === 0) {
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
    [participants]
  );

  const isMeActiveParticipant = useMemo(
    () =>
      !!activeParticipants.find(
        (activeParticipant) => activeParticipant.participant.identity === userId
      ),
    [activeParticipants, userId]
  );

  return {
    activeParticipants,
    passiveListeners,

    isMeActiveParticipant,

    becomeActiveParticipant,
    becomePassiveParticipant,
  };
};
