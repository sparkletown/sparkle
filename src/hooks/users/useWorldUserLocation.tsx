import { shallowEqual } from "react-redux";

import { UserLocation } from "types/User";

import { withId, WithId } from "utils/id";
import { worldUsersByIdSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";

export const useWorldUserLocation = (
  userId?: string
): { userLocation?: WithId<UserLocation> } => {
  // TODO: Currently this throws an error because VenuePage doesn't have WorldUsersProvider in scope. Fix this.
  // useConnectWorldUsers();

  const userLocation = useSelector((state) => {
    if (!userId) return;

    const user = worldUsersByIdSelector(state)?.[userId];

    if (!user) return;

    const userLocation: UserLocation = {
      lastSeenAt: user.lastSeenAt,
      lastSeenIn: user.lastSeenIn,
    };

    return withId(userLocation, userId);
  }, shallowEqual);

  return {
    userLocation,
  };
};
