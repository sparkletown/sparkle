import { useCallback, useEffect, useMemo } from "react";
import { chunk } from "lodash";

import { universeUsersSelector, usersByIdSelector } from "utils/selectors";
import { WithId, withId } from "utils/id";

import { useSelector } from "hooks/useSelector";
import { useUserLastSeenThreshold } from "hooks/useUserLastSeenThreshold";
import { useVenueId } from "hooks/useVenueId";
import {
  useSparkleFirestoreConnect,
  isLoaded,
  SparkleRFQConfig,
} from "hooks/useSparkleFirestoreConnect";
import { useConnectRelatedVenues } from "hooks/useConnectRelatedVenues";

import { User } from "types/User";
import {
  useFirestore,
  useFirestoreConnect,
  WhereOptions,
} from "react-redux-firebase";
import { useConnectCurrentVenueNG } from "./useConnectCurrentVenueNG";

// NOTE: Logically correct version of pulling users
export const useConnectUniverseUsers = () => {
  const venueId = useVenueId();
  const firestore = useFirestore();

  const { currentVenue, isCurrentVenueLoaded } = useConnectCurrentVenueNG();

  const { relatedVenues, isRelatedVenuesLoaded } = useConnectRelatedVenues({
    venueId,
  });

  // useEffect(() => {
  //   if (!isRelatedVenuesLoaded) return;

  //   const universeUserVenueIds = relatedVenues.map((venue) => venue.id);

  //   const chunkedListeners = chunk(universeUserVenueIds, 10).map<
  //     SparkleRFQConfig
  //   >((venueIdsChunk) => ({
  //     collection: "users",
  //     where: ["enteredVenueIds", "array-contains", venueIdsChunk[0]],
  //     storeAs: "universeUsers",
  //   }));

  //   firestore.setListeners(chunkedListeners);
  // }, [isRelatedVenuesLoaded, relatedVenues]);

  // const usersQuery = useMemo<SparkleRFQConfig | undefined>(() => {
  //   if (!isRelatedVenuesLoaded || !venueId) return;

  //   const universeUserVenueIds = relatedVenues.map((venue) => venue.id);

  //   console.log("venues", relatedVenues);

  //   return {
  //     collection: "users",
  //     where: ["enteredVenueIds", "array-contains-any", universeUserVenueIds],
  //     storeAs: "universeUsers",
  //   };
  // }, [venueId, isRelatedVenuesLoaded]);

  // useSparkleFirestoreConnect(usersQuery);

  // if (!isRelatedVenuesLoaded || !venueId) return;

  const queryFn = (): SparkleRFQConfig[] => {
    if (!isRelatedVenuesLoaded) return [];

    const universeUserVenueIds = relatedVenues.map((venue) => venue.id);

    return [
      {
        collection: "users",
        where: ["enteredVenueIds", "array-contains", universeUserVenueIds[1]],
        storeAs: "universeUsers",
      },
    ];
  };

  useSparkleFirestoreConnect(queryFn);

  // useSparkleFirestoreConnect(
  //   venueId && isRelatedVenuesLoaded
  //     ? {
  //         collection: "users",
  //         where: ["enteredVenueIds", "array-contains", universeUserVenueIds[1]],
  //         storeAs: "universeUsers",
  //       }
  //     : undefined
  // );
};

export const useUniverseUsers = () => {
  useConnectUniverseUsers();

  const selectedUniverseUsers = useSelector(universeUsersSelector);

  console.log("users", selectedUniverseUsers);

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

  const universeUsersById = useSelector(usersByIdSelector);

  return useMemo(() => universeUsersById, [universeUsersById]);
};
