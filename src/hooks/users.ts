import { useMemo } from "react";

import { universeUsersSelector, usersByIdSelector } from "utils/selectors";
import { WithId } from "utils/id";

import { useSelector } from "hooks/useSelector";
import { useUserLastSeenThreshold } from "hooks/useUserLastSeenThreshold";
import { useVenueId } from "hooks/useVenueId";
import {
  useSparkleFirestoreConnect,
  isLoaded,
} from "hooks/useSparkleFirestoreConnect";
import { useConnectCurrentVenueNG } from "hooks/useConnectCurrentVenueNG";
import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";

import { User } from "types/User";

// NOTE: Heuristic approach. Way faster and efficient.
// Is based on assumption that there is only one parent venue and it is an entry point for any user
export const useConnectUniverseUsers = () => {
  const venueId = useVenueId();

  const { currentVenue, isCurrentVenueLoaded } = useConnectCurrentVenueNG(
    venueId
  );

  useSparkleFirestoreConnect(() => {
    if (!isCurrentVenueLoaded || !currentVenue || !venueId) return [];

    const queryVenueId = currentVenue.parentId || venueId;
    return [
      {
        collection: "users",
        where: ["enteredVenueIds", "array-contains", queryVenueId],
        storeAs: "universeUsers",
      },
    ];
  });
};

// NOTE: Logically correct version of pulling users
export const useConnectUniverseUsers_V2 = () => {
  const venueId = useVenueId();

  const { relatedVenues, isRelatedVenuesLoaded } = useConnectRelatedVenues({
    venueId,
  });

  useSparkleFirestoreConnect(() => {
    if (!isRelatedVenuesLoaded) return [];

    const universeUserVenueIds = relatedVenues.map((venue) =>
      venue.name.toLowerCase()
    );

    return universeUserVenueIds.map((venueId) => ({
      collection: "users",
      where: ["enteredVenueIds", "array-contains", venueId],
      storeAs: "universeUsers",
    }));
  });
};

export const useUniverseUsers = () => {
  useConnectUniverseUsers();

  const selectedUniverseUsers = useSelector(universeUsersSelector);

  return useMemo(
    () => ({
      universeUsers: selectedUniverseUsers ?? [],
      isUniverseUsersLoaded: isLoaded(selectedUniverseUsers),
    }),
    [selectedUniverseUsers]
  );
};

// FIXME before merge: will be renamed into useRecentUniverseUsers
export const usePartygoers = (): readonly WithId<User>[] => {
  const lastSeenThreshold = useUserLastSeenThreshold();

  const { universeUsers } = useUniverseUsers();

  return useMemo(
    () => universeUsers.filter((user) => user.lastSeenAt > lastSeenThreshold),
    [universeUsers, lastSeenThreshold]
  );
};

// FIXME before merge: will be renamed into useUniverseUsersById
export const useUsersById = () => {
  useConnectUniverseUsers();

  return useSelector(usersByIdSelector);
};
