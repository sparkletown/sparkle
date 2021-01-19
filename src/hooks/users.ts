import { useMemo } from "react";

import { worldUsersSelector, usersByIdSelector } from "utils/selectors";
import { WithId } from "utils/id";

import { useSelector } from "./useSelector";
import { useUserLastSeenThreshold } from "./useUserLastSeenThreshold";
import { useConnectCurrentVenueNG } from "./useConnectCurrentVenueNG";
import { useVenueId } from "./useVenueId";
import { useFirestoreConnect, isLoaded } from "./useFirestoreConnect";

import { User } from "types/User";
import { useConnectRelatedVenues } from "./useConnectRelatedVenues";

export const useConnectWorldUsers = () => {
  const venueId = useVenueId();

  const { isCurrentVenueLoaded, currentVenue } = useConnectCurrentVenueNG(
    venueId!
  );

  useFirestoreConnect(
    isCurrentVenueLoaded && currentVenue
      ? {
          collection: "users",
          where: [
            "enteredVenueIds",
            "array-contains",
            currentVenue.parentId || currentVenue.id,
          ],
          storeAs: "worldUsers",
        }
      : undefined
  );
};

export const useWorldUsers = (): {
  worldUsers: readonly WithId<User>[];
  isWorldUsersLoaded: boolean;
} => {
  useConnectWorldUsers();

  const selectedUniverseUsers = useSelector(worldUsersSelector);

  return useMemo(
    () => ({
      worldUsers: selectedUniverseUsers ?? [],
      isWorldUsersLoaded: isLoaded(selectedUniverseUsers),
    }),
    [selectedUniverseUsers]
  );
};

export const useRecentWorldUsers = (): {
  recentWorldUsers: readonly WithId<User>[];
  isRecentWorldUsersLoaded: boolean;
} => {
  const venueId = useVenueId();
  const lastSeenThreshold = useUserLastSeenThreshold();

  const { currentVenue, parentVenue } = useConnectRelatedVenues({ venueId });
  const parentVenueName = parentVenue?.name;

  const { worldUsers, isWorldUsersLoaded } = useWorldUsers();

  return useMemo(
    () => ({
      recentWorldUsers: currentVenue
        ? worldUsers.filter(
            (user) =>
              user.lastSeenIn?.[parentVenueName || currentVenue.name] >
              lastSeenThreshold
          )
        : [],
      isRecentWorldUsersLoaded: isWorldUsersLoaded,
    }),
    [
      worldUsers,
      isWorldUsersLoaded,
      lastSeenThreshold,
      currentVenue,
      parentVenueName,
    ]
  );
};

export const useWorldUsersById = () => {
  useConnectWorldUsers();

  const worldUsersById = useSelector(usersByIdSelector);

  return useMemo(() => worldUsersById, [worldUsersById]);
};
