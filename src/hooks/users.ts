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

export const useRecentPartyUsers = () => [];
// export const useRecentPartyUsers = (venueName: string): WithId<User>[] => {
//   const venueId = useVenueId();
//   const partygoers = useSelector(partygoersSelector) ?? [];

//   const { parentVenue, relatedVenues } = useConnectRelatedVenues({
//     venueId,
//   });

//   const lastSeenThreshold = useUserLastSeenThreshold();

//   const parentVenueName = parentVenue?.name ?? "";

//   const filterPartygoersByHierarchy = useCallback(
//     (partygoer: WithId<User>) => {
//       return relatedVenues?.map((venue) => {
//         return (
//           partygoer?.lastSeenIn?.[parentVenueName || venueName || venue.name] >
//           lastSeenThreshold
//         );
//       });
//     },
//     [lastSeenThreshold, parentVenueName, relatedVenues, venueName]
//   );

//   return useMemo(() => partygoers.filter(filterPartygoersByHierarchy), [
//     partygoers,
//     filterPartygoersByHierarchy,
//   ]);
// };

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
export const useConnectWorldUsers_V2 = () => {
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

const useConnectVenueUsers = () => {
  const venueId = useVenueId();

  useSparkleFirestoreConnect(
    venueId
      ? {
          collection: "users",
          where: ["enteredVenueIds", "array-contains", venueId],
          storeAs: "universeUsers",
        }
      : undefined
  );
};

export const useVenueUsers = (): readonly WithId<User>[] => {
  useConnectVenueUsers();

  return useSelector(universeUsersSelector) ?? [];
};

export const usePartygoers = (): readonly WithId<User>[] => {
  const lastSeenThreshold = useUserLastSeenThreshold();

  const venueUsers = useVenueUsers();

  return useMemo(
    () => venueUsers.filter((user) => user.lastSeenAt > lastSeenThreshold),
    [venueUsers, lastSeenThreshold]
  );
};

export const useIsVenueUsersLoaded = () => {
  // @debt The reason for this useConnect to be here is that we have entry point components,
  // which have useConnects calls. And there are checks for the data loaded statuses.
  // We want to gradualy move from that approach to a more modular one, where the specific data is connected where it is required
  useConnectVenueUsers();

  const users = useSelector(universeUsersSelector);

  return isLoaded(users);
};

export const useUsersById = () => {
  useConnectVenueUsers();

  return useSelector(usersByIdSelector);
};
