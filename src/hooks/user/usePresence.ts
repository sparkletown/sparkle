import { useCallback, useEffect, useState } from "react";
import { useInterval } from "react-use";

import { USER_PRESENCE_CHECKIN_INTERVAL } from "settings";

import { doCheckIn, removeCheckIn, subscribeToCheckIns } from "api/presence";

import { SpaceId } from "types/id";
import { UserPresenceDocument } from "types/userPresence";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";
import { useLiveUser } from "hooks/user/useLiveUser";

/*
 * Presence is tracked in a dedicated collection. This allows for subscribing
 * to *just* the minimal information required for knowing roughly who is in
 * what space. The data is structured in a way that allows someone to have
 * multiple tabs open without breaking presence (e.g. they can be present in
 * multiple spaces at once).
 *
 * Presence records are kept fresh using an interval and then a scheduled job
 * runs to clean up stale records. This captures the situation where a user
 * closes their browser and normal clean up doesn't happen.
 *
 * When a user moves between spaces their presence record is updated instantly.
 *
 * Counts of presence records are also cached on a per space basis (recalculated
 * by a scheduled job). This can be used as a fallback when there are lots of
 * users in a space and we don't want to fetch *all* the records.
 *
 * Updates are debounced to avoid render thrash.
 */

interface usePresenceDataOptions {
  spaceIds: SpaceId[];
  limit?: number;
  debounceInterval?: number;
}

/*
 * Hook for listening to (debounced) presence data
 */
export const usePresenceData = ({
  spaceIds,
  limit,
  debounceInterval,
}: usePresenceDataOptions) => {
  const [presentUsersBySpace, setPresentUsers] = useState<{
    [spaceId: SpaceId]: UserPresenceDocument[];
  }>();

  useEffect(() => {
    const unsubscribe = subscribeToCheckIns({
      spaceIds,
      limit,
      debounceInterval,
      callback: setPresentUsers,
    });
    return () => {
      unsubscribe();
    };
  }, [debounceInterval, limit, spaceIds]);

  return {
    isLoading: presentUsersBySpace === undefined,
    presentUsersBySpace: presentUsersBySpace || {},
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
  const { userId, profile, isLoading: userIsLoading } = useLiveUser();

  const performCheckIn = useCallback(() => {
    if (userId && space) {
      doCheckIn({
        id: checkInId,
        worldId: space.worldId,
        spaceId: space.id,
        userId,
        partyName: profile?.partyName,
        pictureUrl: profile?.pictureUrl,
      }).then((newCheckInId) => {
        setCheckInId(newCheckInId);
      });
    }
  }, [checkInId, profile?.partyName, profile?.pictureUrl, space, userId]);

  useEffect(() => {
    if (isLoading || userIsLoading) {
      return;
    }

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
