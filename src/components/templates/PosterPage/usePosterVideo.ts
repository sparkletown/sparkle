import { useMemo } from "react";
import { LocalParticipant, RemoteParticipant } from "twilio-video";

import { ParticipantWithUser } from "types/rooms";
import { User } from "types/User";

import { WithId } from "utils/id";

import { useVideoRoomState } from "hooks/twilio/useVideoRoomState";
import { useUser } from "hooks/useUser";

export const usePosterVideo = (venueId: string) => {
  const { userId, userWithId } = useUser();

  const {
    participants,
    localParticipant,

    hasRoom,

    loading: isRoomLoading,

    retryConnect,
    becomeActiveParticipant,
    becomePassiveParticipant,
  } = useVideoRoomState(userId, venueId, false);

  const localParticipantWithUser:
    | ParticipantWithUser<LocalParticipant>
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

  const hasParticipants = allParticipants.length > 0;

  const { passiveListeners, activeParticipants } = useMemo(
    () =>
      allParticipants.reduce<{
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
    [allParticipants]
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

    hasRoom,
    hasParticipants,

    isMeActiveParticipant,
    isRoomLoading,

    retryConnect,
    becomeActiveParticipant,
    becomePassiveParticipant,
  };
};
