import { useCallback, useMemo } from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";

import { withId, WithId } from "utils/id";

import { User } from "types/User";

import { useUser } from "hooks/useUser";
import { useWorldUsersByIdWorkaround } from "hooks/users";
import { useVideoRoom } from "hooks/useVideoRoom";

export const usePosterVideo = (venueId: string) => {
  const { userId } = useUser();
  const { worldUsersById } = useWorldUsersByIdWorkaround();

  const { participants, turnVideoOff, turnVideoOn } = useVideoRoom({
    userId,
    roomName: venueId,
  });

  const getUserById = useCallback(
    (id: string) => {
      const user = worldUsersById[id];

      if (!user) return;

      return withId(user, id);
    },
    [worldUsersById]
  );

  const { passiveListeners, activeParticipants } = useMemo(
    () =>
      participants.reduce<{
        passiveListeners: WithId<User>[];
        activeParticipants: (RemoteParticipant | LocalParticipant)[];
      }>(
        (acc, participant) => {
          // If participant is not broadcasting video, put him into passiveListeners
          if (participant.videoTracks.size === 0) {
            const user = getUserById(participant.identity);

            if (!user) return acc;

            return {
              ...acc,
              passiveListeners: [...acc.passiveListeners, user],
            };
          }

          return {
            ...acc,
            activeParticipants: [...acc.activeParticipants, participant],
          };
        },
        {
          passiveListeners: [],
          activeParticipants: [],
        }
      ),
    [participants, getUserById]
  );

  const isMeActiveParticipant = useMemo(
    () =>
      !!activeParticipants.find(
        (participant) => participant.identity === userId
      ),
    [activeParticipants, userId]
  );

  return {
    activeParticipants,
    passiveListeners,

    isMeActiveParticipant,

    turnVideoOn,
    turnVideoOff,
  };
};
