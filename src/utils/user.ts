import { omit, pick } from "lodash";

import { RefiAuthUser } from "types/fire";
import { User, UserLocation, UserWithLocation } from "types/User";

import { WithId } from "./id";
import { isTruthy } from "./types";

export const getUserLocationData = ({
  worldUserLocationsById,
  user,
}: {
  worldUserLocationsById: Record<string, WithId<UserLocation>>;
  user: WithId<User>;
}) => {
  const userLocation: WithId<UserLocation> | undefined =
    worldUserLocationsById[user.id];

  return userLocation;
};

export const omitLocationFromUser = <T extends UserWithLocation>(user: T) =>
  omit(
    user,
    "lastVenueIdSeenIn",
    "lastSeenAt",
    "enteredVenueIds",
    "enteredWorldIds"
  );

export const extractLocationFromUser = <T extends UserWithLocation>(user: T) =>
  pick(
    user,
    "lastVenueIdSeenIn",
    "lastSeenAt",
    "enteredVenueIds",
    "enteredWorldIds"
  );

export const isCompleteUserInfo = (user: RefiAuthUser | null | undefined) =>
  isTruthy(user?.displayName) && isTruthy(user?.photoURL);
