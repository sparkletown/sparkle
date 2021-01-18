import { useMemo } from "react";

import { worldUsersSelector, usersByIdSelector } from "utils/selectors";
import { WithId } from "utils/id";

import { useSelector } from "./useSelector";
import { useUserLastSeenThreshold } from "./useUserLastSeenThreshold";
import { useConnectCurrentVenueNG } from "./useConnectCurrentVenueNG";
import { useVenueId } from "./useVenueId";
import { useFirestoreConnect, isLoaded } from "./useFirestoreConnect";

import { User } from "types/User";

export const useConnectWorldUsers = () => {
  const venueId = useVenueId();

  const { isCurrentVenueLoaded, currentVenue } = useConnectCurrentVenueNG(
    venueId!
  );

  useFirestoreConnect(() => {
    if (!isCurrentVenueLoaded || !currentVenue) return [];

    console.log(currentVenue.parentId, currentVenue.id);

    return [
      {
        collection: "users",
        where: [
          "enteredVenueIds",
          "array-contains",
          currentVenue.parentId || currentVenue.id,
        ],
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

  const selectedUniverseUsers = useSelector(worldUsersSelector);

  console.log("users", selectedUniverseUsers);

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
  const lastSeenThreshold = useUserLastSeenThreshold();

  const { worldUsers, isWorldUsersLoaded } = useWorldUsers();

  return useMemo(
    () => ({
      recentWorldUsers: worldUsers.filter(
        (user) => user.lastSeenAt > lastSeenThreshold
      ),
      isRecentWorldUsersLoaded: isWorldUsersLoaded,
    }),
    [worldUsers, isWorldUsersLoaded, lastSeenThreshold]
  );
};

export const useWorldUsersById = () => {
  useConnectWorldUsers();

  const worldUsersById = useSelector(usersByIdSelector);

  return useMemo(() => worldUsersById, [worldUsersById]);
};
