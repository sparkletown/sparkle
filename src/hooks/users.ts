import { useMemo } from "react";
import { isLoaded } from "react-redux-firebase";

import { usersSelector, usersByIdSelector } from "utils/selectors";
import { WithId } from "utils/id";

import { useSelector } from "hooks/useSelector";
import { useUserLastSeenThreshold } from "hooks/useUserLastSeenThreshold";
import { useVenueId } from "hooks/useVenueId";
import { useSparkleFirestoreConnect } from "hooks/useSparkleFirestoreConnect";

import { User } from "types/User";

const useConnectUsers = () => {
  const venueId = useVenueId();

  useSparkleFirestoreConnect(
    venueId
      ? {
          collection: "users",
          where: ["enteredVenueIds", "array-contains", venueId],
          storeAs: "users",
        }
      : undefined
  );
};

export const usePartygoers = (): readonly WithId<User>[] => {
  useConnectUsers();

  const lastSeenThreshold = useUserLastSeenThreshold();

  const users = useSelector(usersSelector) ?? [];

  return useMemo(
    () => users.filter((user) => user.lastSeenAt > lastSeenThreshold),
    [users, lastSeenThreshold]
  );
};

export const useIsUsersLoaded = () => {
  useConnectUsers();

  const users = useSelector(usersSelector);

  return useMemo(() => isLoaded(users), [users]);
};

export const useUsersById = () => {
  useConnectUsers();

  return useSelector(usersByIdSelector);
};

export const useVenueUsers = (): readonly WithId<User>[] => {
  useConnectUsers();

  return useSelector(usersSelector) ?? [];
};

export const useCampPartygoers = (
  venueName: string
): readonly WithId<User>[] => {
  const partygoers = usePartygoers();

  const lastSeenThreshold = useUserLastSeenThreshold();

  return useMemo(
    () =>
      partygoers.filter(
        (partygoer) => partygoer?.lastSeenIn?.[venueName] > lastSeenThreshold
      ),
    [partygoers, lastSeenThreshold, venueName]
  );
};
