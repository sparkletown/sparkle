import { useMemo } from "react";
import { isLoaded } from "react-redux-firebase";

import { usersSelector, usersByIdSelector } from "utils/selectors";
import { WithId } from "utils/id";

import { useSelector } from "hooks/useSelector";
import { useUserLastSeenThreshold } from "hooks/useUserLastSeenThreshold";
import { useVenueId } from "hooks/useVenueId";
import { useSparkleFirestoreConnect } from "hooks/useSparkleFirestoreConnect";

import { User } from "types/User";

const useConnectVenueUsers = () => {
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

export const useVenueUsers = (): readonly WithId<User>[] => {
  useConnectVenueUsers();

  return useSelector(usersSelector) ?? [];
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

  const users = useSelector(usersSelector);

  return isLoaded(users);
};

export const useUsersById = () => {
  useConnectVenueUsers();

  return useSelector(usersByIdSelector);
};
