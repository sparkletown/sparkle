import { useCallback, useMemo } from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";

import { withId, WithId } from "utils/id";

import { User } from "types/User";

import { useUser } from "hooks/useUser";
import { useWorldUsersByIdWorkaround } from "hooks/users";
import { useVideoRoomState } from "hooks/twilio";

export const usePosterVideo = (venueId: string) => {
  const { userId } = useUser();
  const { worldUsersById } = useWorldUsersByIdWorkaround();

  const {
    participants,
    turnVideoOff: leaveVideoSeat,
    turnVideoOn: takeVideoSeat,
  } = useVideoRoomState({
    userId,
    roomName: venueId,
    showVideoByDefault: false,
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
        activeParticipants: {
          participant: RemoteParticipant | LocalParticipant;
          user: WithId<User>;
        }[];
      }>(
        (acc, participant) => {
          const user = getUserById(participant.identity);

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
    [participants, getUserById]
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

    takeVideoSeat,
    leaveVideoSeat,
  };
};
