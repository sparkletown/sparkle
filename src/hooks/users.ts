import { useMemo } from "react";
import { isLoaded, useFirestoreConnect } from "react-redux-firebase";

import { universeUsersSelector, usersByIdSelector } from "utils/selectors";
import { WithId } from "utils/id";

import { useSelector } from "hooks/useSelector";
import { useUserLastSeenThreshold } from "hooks/useUserLastSeenThreshold";
import { useVenueId } from "hooks/useVenueId";
import { useSparkleFirestoreConnect } from "hooks/useSparkleFirestoreConnect";
import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";

import { User } from "types/User";
import { useConnectCurrentVenueNG } from "./useConnectCurrentVenueNG";

// NOTE: Heuristic approach. Way faster and efficient.
// Is based on assumption that there is only one parent venue and it is an entry point for any user
export const useConnectUniverseUsers = () => {
  const venueId = useVenueId();

  const { currentVenue, isCurrentVenueLoaded } = useConnectCurrentVenueNG(
    venueId
  );

  useSparkleFirestoreConnect(() => {
    if (!isCurrentVenueLoaded || !currentVenue) return [];

    const rawVenueId = currentVenue.parentId || currentVenue.name;
    const venueId = rawVenueId.toLowerCase();
    return [
      {
        collection: "users",
        where: ["enteredVenueIds", "array-contains", venueId],
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

  useFirestoreConnect(() => {
    if (!isRelatedVenuesLoaded) return [];

    const worldUsersVenueNames = relatedVenues.map((venue) =>
      venue.name.toLowerCase()
    );

    console.log({ worldUsersVenueNames });

    return worldUsersVenueNames.map((venueName) => ({
      collection: "users",
      where: ["enteredVenueIds", "array-contains", venueName],
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
