import { useMemo } from "react";

import { User } from "types/User";

import { WithId } from "utils/id";
import { normalizeTimestampToMilliseconds } from "utils/time";

import { worldUsersByIdSelector, worldUsersSelector } from "utils/selectors";

import { useSelector } from "./useSelector";
import { useUserLastSeenThreshold } from "./useUserLastSeenThreshold";
import { useConnectCurrentVenueNG } from "./useConnectCurrentVenueNG";
import { useVenueId } from "./useVenueId";
import { useFirestoreConnect, isLoaded } from "./useFirestoreConnect";
import { useSovereignVenueId } from "./useSovereignVenueId";

export const useConnectWorldUsers = () => {
  const venueId = useVenueId();

  const { sovereignVenueId, isSovereignVenueIdLoading } = useSovereignVenueId();

  useFirestoreConnect(() => {
    if (isSovereignVenueIdLoading || !sovereignVenueId || !venueId) return [];

    const relatedLocationIds = [venueId];

    if (sovereignVenueId) {
      relatedLocationIds.push(sovereignVenueId);
    }

    return [
      {
        collection: "users",
        where: ["enteredVenueIds", "array-contains-any", relatedLocationIds],
        storeAs: "worldUsers",
      },
    ];
  });
};

export const useWorldUsers = (): {
  worldUsers: readonly WithId<User>[];
  isWorldUsersLoaded: boolean;
} => {
  useConnectWorldUsers();

  const selectedWorldUsers = useSelector(worldUsersSelector);

  return useMemo(
    () => ({
      worldUsers: selectedWorldUsers ?? [],
      isWorldUsersLoaded: isLoaded(selectedWorldUsers),
    }),
    [selectedWorldUsers]
  );
};

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

export const useRecentWorldUsers = (): {
  recentWorldUsers: readonly WithId<User>[];
  isRecentWorldUsersLoaded: boolean;
} => {
  const lastSeenThreshold = useUserLastSeenThreshold();

  const { worldUsers, isWorldUsersLoaded } = useWorldUsers();

  return useMemo(
    () => ({
      recentWorldUsers: worldUsers.filter(
        (user) =>
          normalizeTimestampToMilliseconds(user.lastSeenAt) > lastSeenThreshold
      ),
      isRecentWorldUsersLoaded: isWorldUsersLoaded,
    }),
    [worldUsers, isWorldUsersLoaded, lastSeenThreshold]
  );
};

/**
 * @description this hook's filtering world users based on their @lastSeenIn location
 *
 * @param locationName is a key for `lastSeenIn` firestore field in user's object
 *
 * @example useRecentLocationUsers(venue.name)
 * @example useRecentLocationUsers(`${venue.name}/${roomTitle}`)
 */
export const useRecentLocationUsers = (locationName?: string) => {
  const lastSeenThreshold = useUserLastSeenThreshold();
  const { worldUsers, isWorldUsersLoaded } = useWorldUsers();

  return useMemo(
    () => ({
      recentLocationUsers: locationName
        ? worldUsers.filter(
            (user) =>
              user.lastSeenIn?.[locationName] &&
              normalizeTimestampToMilliseconds(user.lastSeenIn[locationName]) >
                lastSeenThreshold
          )
        : [],
      isRecentLocationUsersLoaded: isWorldUsersLoaded,
    }),
    [worldUsers, isWorldUsersLoaded, lastSeenThreshold, locationName]
  );
};

export const useRecentVenueUsers = () => {
  const venueId = useVenueId();

  const { currentVenue } = useConnectCurrentVenueNG(venueId);

  const {
    recentLocationUsers,
    isRecentLocationUsersLoaded,
  } = useRecentLocationUsers(currentVenue?.name);

  return {
    recentVenueUsers: recentLocationUsers,
    isRecentVenueUsersLoaded: isRecentLocationUsersLoaded,
  };
};
