import { Experience, User, UserLocation } from "types/User";

import { WithId } from "./id";

export const getUserExperience = (venueName?: string) => (
  user?: User
): Experience | undefined => {
  if (!venueName || !user) return;

  return user?.data?.[venueName];
};

export const getUserLocationData = ({
  worldUserLocationsById,
  user,
  childLocation,
  parentLocation,
  location,
}: {
  worldUserLocationsById: Record<string, WithId<UserLocation>>;
  user: WithId<User>;
  childLocation: string;
  parentLocation: string;
  location: string;
}) => {
  const userLocation: WithId<UserLocation> | undefined =
    worldUserLocationsById[user.id];

  const userLastSeenIn =
    Object.keys(userLocation.lastSeenIn)[0] &&
    !!Object.keys(userLocation.lastSeenIn)[0].includes(childLocation);
  const userLastSeenLocation =
    userLocation.lastSeenIn?.[parentLocation] ||
    userLocation.lastSeenIn?.[childLocation] ||
    userLocation.lastSeenIn?.[location] ||
    Object.values(userLocation.lastSeenIn)[0];
  const isLocationMatch = userLastSeenIn && userLastSeenLocation;
  return {
    isLocationMatch,
    userLastSeenLocation,
  };
};
