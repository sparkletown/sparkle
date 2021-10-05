import { omit, pick } from "lodash";

import { User, UserLocation, UserWithLocation } from "types/User";

import { WithId } from "./id";
import { wrapIntoSlashes } from "./string";

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

export const omitLocationFromUser = <T extends UserWithLocation>(user: T) =>
  omit(user, "lastVenueIdSeenIn", "lastSeenAt", "enteredVenueIds");

export const extractLocationFromUser = <T extends UserWithLocation>(user: T) =>
  pick(user, "lastVenueIdSeenIn", "lastSeenAt", "enteredVenueIds");
