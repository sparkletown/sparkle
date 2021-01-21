import { useMemo } from "react";

import { User } from "types/User";

import { worldUsersSelector, worldUsersByIdSelector } from "utils/selectors";
import { WithId } from "utils/id";

import { useSelector } from "./useSelector";
import { useUserLastSeenThreshold } from "./useUserLastSeenThreshold";
import { useConnectCurrentVenueNG } from "./useConnectCurrentVenueNG";
import { useVenueId } from "./useVenueId";
import { useFirestoreConnect, isLoaded } from "./useFirestoreConnect";

export const useConnectWorldUsers = () => {
  const venueId = useVenueId();

  const { isCurrentVenueLoaded, currentVenue } = useConnectCurrentVenueNG(
    venueId
  );

  useFirestoreConnect(() => {
    if (!isCurrentVenueLoaded || !currentVenue || !venueId) return [];

    const relatedLocationIds = [currentVenue.id];

    if (currentVenue.parentId) {
      relatedLocationIds.push(currentVenue.parentId);
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

export const useRecentWorldsUsers = (): {
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

export const useRecentVenueUsers = (): {
  recentVenueUsers: readonly WithId<User>[];
  isRecentVenueUsersLoaded: boolean;
} => {
  const lastSeenThreshold = useUserLastSeenThreshold();
  const venueId = useVenueId();

  const { worldUsers, isWorldUsersLoaded } = useWorldUsers();

  const { isCurrentVenueLoaded, currentVenue } = useConnectCurrentVenueNG(
    venueId
  );

  return useMemo(
    () => ({
      recentVenueUsers:
        isCurrentVenueLoaded && currentVenue
          ? worldUsers.filter(
              (user) => user.lastSeenIn?.[currentVenue.name] > lastSeenThreshold
            )
          : [],
      isRecentVenueUsersLoaded: isWorldUsersLoaded,
    }),
    [
      worldUsers,
      isWorldUsersLoaded,
      lastSeenThreshold,
      isCurrentVenueLoaded,
      currentVenue,
    ]
  );
};

export const useRecentRoomUsers = (
  roomTitle?: string
): {
  recentRoomUsers: readonly WithId<User>[];
  isRecentRoomUsersLoaded: boolean;
} => {
  const venueId = useVenueId();
  const lastSeenThreshold = useUserLastSeenThreshold();

  const { worldUsers, isWorldUsersLoaded } = useWorldUsers();

  const { isCurrentVenueLoaded, currentVenue } = useConnectCurrentVenueNG(
    venueId
  );

  return useMemo(
    () => ({
      recentRoomUsers:
        isCurrentVenueLoaded && currentVenue && roomTitle
          ? worldUsers.filter(
              (user) =>
                user.lastSeenIn?.[`${currentVenue.name}/${roomTitle}`] >
                lastSeenThreshold
            )
          : [],
      isRecentRoomUsersLoaded: isWorldUsersLoaded,
    }),
    [
      worldUsers,
      isWorldUsersLoaded,
      isCurrentVenueLoaded,
      currentVenue,
      roomTitle,
      lastSeenThreshold,
    ]
  );
};
