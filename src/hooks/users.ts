import { useEffect, useMemo } from "react";
import { shallowEqual } from "react-redux";
import { isEqual } from "lodash";

import { User, UserLocation, userWithLocationToUser } from "types/User";
import { ReactHook } from "types/utility";

import { withId, WithId } from "utils/id";
import { normalizeTimestampToMilliseconds } from "utils/time";

import { worldUsersByIdSelector, worldUsersSelector } from "utils/selectors";
import { useWorldUsersContext } from "./users/useWorldUsers";

import { useSelector } from "./useSelector";
import { useUserLastSeenThreshold } from "./useUserLastSeenThreshold";
import { isLoaded } from "./useFirestoreConnect";

export { useWorldUsers } from "./users/useWorldUsers";

const noUsers: WithId<User>[] = [];

export const useConnectWorldUsers = () => {
  // We mostly use this here to ensure that the WorldUsersProvider has definitely been connected
  useWorldUsersContext();

  useEffect(() => {
    console.log(
      "useConnectWorldUsers is practically a noop at the moment, all the real work happens in WorldUsersProvider in src/hooks/users/useWorldUsers.tsx"
    );
  }, []);
};

// @debt typing, Record implies that a User will exist for literally any given string, which is untrue
export const useWorldUsersById = () => {
  useConnectWorldUsers();

  const worldUsersById = useSelector(worldUsersByIdSelector);

  return useMemo(
    () => ({
      worldUsersById: worldUsersById ?? {},
      isWorldUsersLoaded: isLoaded(worldUsersById),
    }),
    [worldUsersById]
  );
};

// @debt typing, this uses Partial<Record<K,T>> to work around the bug where Record implies that a User will exist for literally any given string, which is untrue
// @debt refactor all usages of Record<string, User> to Partial<Record<string, User>> (then we can remove this workaround)
export const useWorldUsersByIdWorkaround = () => {
  const {
    worldUsersById: _worldUsersById,
    isWorldUsersLoaded,
  } = useWorldUsersById();

  const worldUsersById: Partial<Record<string, User>> = _worldUsersById;

  return { worldUsersById, isWorldUsersLoaded };
};

export const useWorldUserLocation = (
  userId?: string
): { userLocation?: WithId<UserLocation> } => {
  // TODO: Currently this throws an error because VenuePage doesn't have WorldUsersProvider in scope. Fix this.
  // useConnectWorldUsers();

  const userLocation = useSelector((state) => {
    if (!userId) return;

    const user = worldUsersByIdSelector(state)?.[userId];

    if (!user) return;

    const userLocation: UserLocation = {
      lastSeenAt: user.lastSeenAt,
      lastSeenIn: user.lastSeenIn,
    };

    return withId(userLocation, userId);
  }, shallowEqual);

  return {
    userLocation,
  };
};

export const useRecentWorldUsers = (): {
  recentWorldUsers: readonly WithId<User>[];
  isRecentWorldUsersLoaded: boolean;
} => {
  const lastSeenThreshold = useUserLastSeenThreshold();

  useConnectWorldUsers();

  const { recentWorldUsers, isWorldUsersLoaded } = useSelector((state) => {
    const worldUsers = worldUsersSelector(state);
    const isWorldUsersLoaded = isLoaded(worldUsers);

    if (!worldUsers) return { recentWorldUsers: noUsers, isWorldUsersLoaded };

    const recentWorldUsers = worldUsers
      .filter(
        (user) =>
          normalizeTimestampToMilliseconds(user.lastSeenAt) > lastSeenThreshold
      )
      .map(userWithLocationToUser);

    return { recentWorldUsers, isWorldUsersLoaded };
  }, isEqual);

  return {
    recentWorldUsers: recentWorldUsers ?? noUsers,
    isRecentWorldUsersLoaded: isWorldUsersLoaded,
  };
};

/**
 * @description this hook's filtering world users based on their @lastSeenIn location
 *
 * @param locationName is a key for `lastSeenIn` firestore field in user's object
 *
 * @example useRecentLocationUsers(venue.name)
 * @example useRecentLocationUsers(`${venue.name}/${roomTitle}`)
 */
export const useRecentLocationUsers = (
  locationName?: string
): {
  recentLocationUsers: readonly WithId<User>[];
  isRecentLocationUsersLoaded: boolean;
} => {
  const lastSeenThreshold = useUserLastSeenThreshold();

  useConnectWorldUsers();

  const { recentLocationUsers, isWorldUsersLoaded } = useSelector((state) => {
    const worldUsers = worldUsersSelector(state);
    const isWorldUsersLoaded = isLoaded(worldUsers);

    if (!worldUsers || !locationName)
      return { recentLocationUsers: noUsers, isWorldUsersLoaded };

    const recentLocationUsers = worldUsers
      .filter(
        (user) =>
          user.lastSeenIn?.[locationName] &&
          normalizeTimestampToMilliseconds(user.lastSeenIn[locationName]) >
            lastSeenThreshold
      )
      .map(userWithLocationToUser);

    return { recentLocationUsers, isWorldUsersLoaded };
  }, isEqual);

  return {
    recentLocationUsers: recentLocationUsers ?? noUsers,
    isRecentLocationUsersLoaded: isWorldUsersLoaded,
  };
};

export interface UseRecentVenueUsersProps {
  venueName?: string;
}

export interface RecentVenueUsersData {
  recentVenueUsers: readonly WithId<User>[];
  isRecentVenueUsersLoaded: boolean;
}

// @debt refactor this to use venueId as soon as we refactor location tracking to use venueId instead of venueName
export const useRecentVenueUsers: ReactHook<
  UseRecentVenueUsersProps,
  RecentVenueUsersData
> = ({ venueName }) => {
  const {
    recentLocationUsers,
    isRecentLocationUsersLoaded,
  } = useRecentLocationUsers(venueName);

  return {
    recentVenueUsers: recentLocationUsers,
    isRecentVenueUsersLoaded: isRecentLocationUsersLoaded,
  };
};
