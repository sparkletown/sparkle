/**
 * Module for everything related to taken a seat, leaving a seat and updating
 * "I'm still sat here" status.
 */
import { useEffect, useMemo } from "react";
import { useAsyncFn } from "react-use";
import { QueryConstraint } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  VENUE_RECENT_SEATED_USERS_UPDATE_INTERVAL,
} from "settings";

import {
  clearSeatingCheckin,
  doSeatingCheckin,
  setSeat,
  unsetSeat,
} from "api/world";

import { DisplayUser } from "types/User";

import { WithId } from "utils/id";

import { useSeatedUsers } from "./useSeatedUsers";

interface useLivenessUpdaterOptions {
  worldId: string;
  userId: string;
  isSat: boolean;
}

/**
 * Periodically records that the current user is sat at a given seat. This
 * enables users that exited without cleanup to be removed from seats.
 */
const useSeatingCheckin = ({
  worldId,
  userId,
  isSat,
}: useLivenessUpdaterOptions) => {
  useEffect(() => {
    // We use a boolean version of takenSeat so that the hook is only invoked
    // when the user moves between sat and not sat states.
    if (isSat) {
      doSeatingCheckin({ worldId, userId });
      const intervalId = setInterval(() => {
        doSeatingCheckin({ worldId, userId });
      }, VENUE_RECENT_SEATED_USERS_UPDATE_INTERVAL);
      return () => {
        clearInterval(intervalId);
        clearSeatingCheckin({ worldId, userId });
      };
    }
  }, [isSat, userId, worldId]);
};

interface useSeatingOptions {
  user: WithId<DisplayUser>;
  worldId: string;
  spaceId: string;
  additionalWhere?: QueryConstraint[];
}

export const useSeating = <T>({
  user,
  worldId,
  spaceId,
  additionalWhere = ALWAYS_EMPTY_ARRAY,
}: useSeatingOptions) => {
  const {
    users: seatedUsers,
    isLoaded: isSeatedUsersLoaded,
  } = useSeatedUsers<T>({
    worldId,
    spaceId,
    additionalWhere,
  });

  const takenSeat = useMemo(() => {
    return seatedUsers.find(({ id }) => id === user.id);
  }, [seatedUsers, user.id]);
  const isSat = !!takenSeat;

  const [takeSeatState, takeSeat] = useAsyncFn(
    async (seatData: T) => {
      await setSeat<T>({ user, spaceId, worldId, seatData });
    },
    [spaceId, user, worldId]
  );

  const [leaveSeatState, leaveSeat] = useAsyncFn(async () => {
    await unsetSeat({ userId: user.id, worldId });
  }, [user.id, worldId]);

  useSeatingCheckin({ worldId, userId: user.id, isSat });

  // Automatically leave any seat if leaving a space
  useEffect(() => {
    return () => {
      if (isSat) {
        leaveSeat();
      }
    };
  }, [isSat, leaveSeat]);

  return {
    takeSeat,
    takeSeatState,
    leaveSeat,
    leaveSeatState,
    seatedUsers,
    isSeatedUsersLoaded,
    takenSeat,
  };
};
