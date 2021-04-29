import { useMemo } from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";

import { withId, WithId } from "utils/id";

import { User } from "types/User";

import { useUser } from "hooks/useUser";
import { useWorldUsersById } from "hooks/users";
import { useVideoRoom } from "hooks/useVideoRoom";

export const usePosterVideo = (venueId: string) => {
  const { userId } = useUser();
  const { worldUsersById } = useWorldUsersById();

  const { participants, turnVideoOff, turnVideoOn } = useVideoRoom({
    userId,
    roomName: venueId,
  });

  const { passiveListeners, activeParticipants } = useMemo(
    () =>
      participants.reduce<{
        passiveListeners: WithId<User>[];
        activeParticipants: (RemoteParticipant | LocalParticipant)[];
      }>(
        (acc, participant) => {
          if (participant.videoTracks.size === 0) {
            return {
              ...acc,
              passiveListeners: [
                ...acc.passiveListeners,
                withId(
                  worldUsersById[participant.identity],
                  participant.identity
                ),
              ],
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
    [participants, worldUsersById]
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
