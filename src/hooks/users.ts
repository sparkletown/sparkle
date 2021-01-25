import { useMemo } from "react";

import { User } from "types/User";

import {
  worldUsersSelector,
  worldUsersByIdSelector,
  sovereignVenueIdSelector,
} from "utils/selectors";
import { WithId } from "utils/id";
import { normalizeTimestampToMilliseconds } from "utils/time";

import { fetchSovereignVenueId } from "api/sovereignVenueId";

import {
  setSovereignVenueId,
  setSovereignVenueIdIsLoading,
} from "store/actions/SovereignVenueId";

import { useSelector } from "./useSelector";
import { useUserLastSeenThreshold } from "./useUserLastSeenThreshold";
import { useConnectCurrentVenueNG } from "./useConnectCurrentVenueNG";
import { useVenueId } from "./useVenueId";
import { useFirestoreConnect, isLoaded } from "./useFirestoreConnect";
import { useDispatch } from "./useDispatch";

export const useSovereignVenueId = (venueId?: string) => {
  const dispatch = useDispatch();

  const { sovereignVenueId, isSovereignVenueIdLoading } = useSelector(
    sovereignVenueIdSelector
  );

  // NOTE: Force to fetch it only once
  if (!sovereignVenueId && !isSovereignVenueIdLoading && venueId) {
    const onSuccess = (sovereignVenueId: string) => {
      console.log({ sovereignVenueId });
      dispatch(setSovereignVenueId(sovereignVenueId));
      dispatch(setSovereignVenueIdIsLoading(false));
    };
    const onError = () => dispatch(setSovereignVenueIdIsLoading(false));

    dispatch(setSovereignVenueIdIsLoading(true));

    fetchSovereignVenueId(venueId, onSuccess, onError);
  }

  return {
    sovereignVenueId,
    isSovereignVenueIdLoading,
  };
};

export const useConnectWorldUsers = () => {
  const venueId = useVenueId();

  const { sovereignVenueId, isSovereignVenueIdLoading } = useSovereignVenueId(
    venueId
  );
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

export const useRecentRoomUsers = (roomTitle?: string) => {
  const venueId = useVenueId();
  const { currentVenue } = useConnectCurrentVenueNG(venueId);

  let locationName;

  if (currentVenue?.name && roomTitle) {
    locationName = `${currentVenue.name}/${roomTitle}`;
  }

  const {
    recentLocationUsers,
    isRecentLocationUsersLoaded,
  } = useRecentLocationUsers(locationName);

  return {
    recentRoomUsers: recentLocationUsers,
    isRecentRoomUsersLoaded: isRecentLocationUsersLoaded,
  };
};
