import { useMemo } from "react";

import { worldUsersSelector, usersByIdSelector } from "utils/selectors";
import { WithId } from "utils/id";

import { useSelector } from "./useSelector";
import { useUserLastSeenThreshold } from "./useUserLastSeenThreshold";
import { useFirestoreConnect, isLoaded } from "./useFirestoreConnect";

import { User } from "types/User";
import { Venue } from "types/Venue";

export const useConnectWorldUsers = (venue?: WithId<Venue>) => {
  useFirestoreConnect(() => {
    const venueId = venue?.id;

    if (!venueId) return [];

    return [
      {
        collection: "users",
        where: [
          "enteredVenueIds",
          "array-contains",
          venue?.parentId || venueId,
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
  const worldUsersById = useSelector(usersByIdSelector);

  return useMemo(() => worldUsersById, [worldUsersById]);
};
