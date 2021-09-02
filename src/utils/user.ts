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
  roomName,
  venueName,
  location,
}: {
  worldUserLocationsById: Record<string, WithId<UserLocation>>;
  user: WithId<User>;
  roomName: string;
  venueName: string;
  location: string;
}) => {
  const userLocation: WithId<UserLocation> | undefined =
    worldUserLocationsById[user.id];

  const isLocationMatch =
    userLocation.lastSeenIn === venueName ||
    userLocation.lastSeenIn === roomName ||
    userLocation.lastSeenIn === location;

  return {
    isLocationMatch,
    ...userLocation,
  };
};
