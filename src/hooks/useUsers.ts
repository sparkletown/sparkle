import { useMemo } from "react";
import { useFirestoreConnect } from "react-redux-firebase";

import { usersSelector, usersByIdSelector } from "utils/selectors";
import { WithId } from "utils/id";

import { useSelector } from "hooks/useSelector";
import { useUserLastSeenThreshold } from "hooks/useUserLastSeenThreshold";
import { useVenueId } from "hooks/useVenueId";

import { User } from "types/User";

const useConnectUsers = () => {
  useFirestoreConnect("users");
};

export const usePartygoers = () => {
  useConnectUsers();

  const lastSeenThreshold = useUserLastSeenThreshold();

  const users = useSelector(usersSelector);

  return useMemo(
    () => users.filter((user) => user.lastSeenAt > lastSeenThreshold),
    [users, lastSeenThreshold]
  );
};

export const useUsersById = () => {
  useConnectUsers();

  return useSelector(usersByIdSelector);
};

export const useVenueUsers = () => {
  const venueId = useVenueId();
  const users = useSelector(usersSelector);

  return useMemo(
    () =>
      users.filter(
        (user) => venueId && user.enteredVenueIds?.includes(venueId)
      ),
    [users, venueId]
  );
};

export const useCampPartygoers = (venueName: string): WithId<User>[] => {
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
