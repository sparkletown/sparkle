import { Experience, User, UserLocation } from "types/User";

import { WithId } from "./id";
import { wrapIntoSlashes } from "./string";

export const getUserExperience = (venueName?: string) => (
  user?: User
): Experience | undefined => {
  if (!venueName || !user) return;

  return user?.data?.[venueName];
};

export const getUserLocationData = ({
  worldUserLocationsById,
  user,
  portalVenueId,
}: {
  worldUserLocationsById: Record<string, WithId<UserLocation>>;
  user: WithId<User>;
  portalVenueId: string;
}) => {
  const userLocation: WithId<UserLocation> | undefined =
    worldUserLocationsById[user.id];

  const isLocationMatch = userLocation?.lastVenueIdSeenIn?.includes(
    wrapIntoSlashes(portalVenueId)
  );

  return {
    isLocationMatch,
    ...userLocation,
  };
};
