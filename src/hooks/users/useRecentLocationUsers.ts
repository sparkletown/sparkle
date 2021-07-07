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

/**
 * @description this hook's filtering world users based on their @lastSeenIn location
 *
 * @param locationName is a key for `lastSeenIn` firestore field in user's object
 *
 * @example useRecentLocationUsers(venue.name)
 * @example useRecentLocationUsers(`${venue.name}/${roomTitle}`)
 */
export const useRecentLocationUsers = (
  locationName?: string
): {
  recentLocationUsers: readonly WithId<User>[];
  isRecentLocationUsersLoaded: boolean;
} => {
  const lastSeenThreshold = useUserLastSeenThreshold();

  useConnectWorldUsers();

  const { recentLocationUsers, isWorldUsersLoaded } = useSelector((state) => {
    const worldUsers = worldUsersSelector(state);
    const isWorldUsersLoaded = isLoaded(worldUsers);

    if (!worldUsers || !locationName)
      return { recentLocationUsers: noUsers, isWorldUsersLoaded };

    const recentLocationUsers = worldUsers
      .filter(
        (user) =>
          user.lastSeenIn?.[locationName] &&
          normalizeTimestampToMilliseconds(user.lastSeenIn[locationName]) >
            lastSeenThreshold
      )
      .map(userWithLocationToUser);

    return { recentLocationUsers, isWorldUsersLoaded };
  }, isEqual);

  return {
    recentLocationUsers: recentLocationUsers ?? noUsers,
    isRecentLocationUsersLoaded: isWorldUsersLoaded,
  };
};
