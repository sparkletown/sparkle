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
  location,
}: {
  worldUserLocationsById: Record<string, WithId<UserLocation>>;
  user: WithId<User>;
  childLocation: string;
  location: string;
}) => {
  const userLocation: WithId<UserLocation> | undefined =
    worldUserLocationsById[user.id];

  const userLastSeenIn = Object.keys(userLocation.lastSeenIn)[0];
  const userLastSeenLocation =
    userLocation.lastSeenIn?.[location] ||
    userLocation.lastSeenIn?.[childLocation];

  const isLocationMatch = userLastSeenIn && userLastSeenLocation;

  return {
    isLocationMatch,
    userLastSeenLocation,
  };
};
