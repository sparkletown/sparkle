import { shallowEqual } from "react-redux";

import { UserLocation } from "types/User";

import { withId, WithId } from "utils/id";
import { worldUsersByIdSelector } from "utils/selectors";

import { useSelector } from "hooks/useSelector";
import { useWorldUsersContext } from "./useWorldUsers";

export const useWorldUserLocation = (
  userId?: string
): { userLocation?: WithId<UserLocation> } => {
  // We mostly use this here to ensure that the WorldUsersProvider has definitely been connected
  useWorldUsersContext();

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
