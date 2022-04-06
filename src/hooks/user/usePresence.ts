import { useCallback, useEffect, useState } from "react";
import { useInterval } from "react-use";

import { USER_PRESENCE_CHECKIN_INTERVAL } from "settings";

import { doCheckIn, removeCheckIn, subscribeToCheckIns } from "api/presence";

import { SpaceId } from "types/id";
import { UserPresenceDocument } from "types/userPresence";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import { useUser } from "./useUser";

interface usePresenceDataOptions {
  spaceId: SpaceId;
  limit?: number;
  debounceInterval?: number;
}

/*
 * Hook for listening to (debounced) presence data
 */
export const usePresenceData = ({
  spaceId,
  limit,
  debounceInterval,
}: usePresenceDataOptions) => {
  const [presentUsers, setPresentUsers] = useState<UserPresenceDocument[]>();

  useEffect(() => {
    const unsubscribe = subscribeToCheckIns({
      spaceId,
      limit,
      debounceInterval,
      callback: setPresentUsers,
    });
    return () => {
      unsubscribe();
    };
  }, [debounceInterval, limit, spaceId]);

  return {
    isLoading: presentUsers === undefined,
    presentUsers: presentUsers || [],
  };
};

/*
 * This hook is responsible for maintaining the database records for what
 * space (or spaces) a user is currently in. It does this by listening to
 * URL changes as well as performing regular interval checkins to handle the
 * case when a user closes their browser.
 */
export const useTrackPresence = () => {
  const [checkInId, setCheckInId] = useState<string>();
  const { space, isLoading } = useWorldAndSpaceByParams();
  const { userId, profile, isLoading: userIsLoading } = useUser();

  const performCheckIn = useCallback(() => {
    if (userId && space) {
      doCheckIn({
        id: checkInId,
        worldId: space.worldId,
        spaceId: space.id,
        userId,
        partyName: profile?.partyName,
        userPictureUrl: profile?.pictureUrl,
      }).then((newCheckInId) => {
        setCheckInId(newCheckInId);
      });
    }
  }, [checkInId, profile?.partyName, profile?.pictureUrl, space, userId]);

  useEffect(() => {
    if (isLoading || userIsLoading) {
      return;
    }

    // TODO Use firstSeenAt for ordering and lastSeenAt for limitation
    // No limit. Use a scheduled job to do cleanup instead
    performCheckIn();

    return () => {
      if (checkInId) {
        removeCheckIn(checkInId);
      }
    };
  }, [checkInId, isLoading, performCheckIn, userIsLoading]);

  // Regular check-in to current location
  useInterval(() => {
    performCheckIn();
  }, USER_PRESENCE_CHECKIN_INTERVAL);
};
