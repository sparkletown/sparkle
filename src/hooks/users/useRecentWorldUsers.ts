import { isLoaded } from "react-redux-firebase";
import { isEqual } from "lodash";

import { User, userWithLocationToUser } from "types/User";

import { WithId } from "utils/id";
import { worldUsersSelector } from "utils/selectors";
import { normalizeTimestampToMilliseconds } from "utils/time";

import { useSelector } from "hooks/useSelector";
import { useConnectWorldUsers } from "hooks/users";
import { useUserLastSeenThreshold } from "hooks/useUserLastSeenThreshold";

const noUsers: WithId<User>[] = [];

export const useRecentWorldUsers = (): {
  recentWorldUsers: readonly WithId<User>[];
  isRecentWorldUsersLoaded: boolean;
} => {
  const lastSeenThreshold = useUserLastSeenThreshold();

  useConnectWorldUsers();

  const { recentWorldUsers, isWorldUsersLoaded } = useSelector((state) => {
    const worldUsers = worldUsersSelector(state);
    const isWorldUsersLoaded = isLoaded(worldUsers);

    if (!worldUsers) return { recentWorldUsers: noUsers, isWorldUsersLoaded };

    const recentWorldUsers = worldUsers
      .filter(
        (user) =>
          normalizeTimestampToMilliseconds(user.lastSeenAt) > lastSeenThreshold
      )
      .map(userWithLocationToUser);

    return { recentWorldUsers, isWorldUsersLoaded };
  }, isEqual);

  return {
    recentWorldUsers: recentWorldUsers ?? noUsers,
    isRecentWorldUsersLoaded: isWorldUsersLoaded,
  };
};
