import { FirebaseReducer } from "react-redux-firebase";
import { omit, pick } from "lodash";

import { DEFAULT_PARTY_NAME } from "settings";

import { BaseUser, User, UserLocation, UserWithLocation } from "types/User";

import { WithId } from "./id";
import { wrapIntoSlashes } from "./string";
import { isTruthy } from "./types";

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

export const isCompleteUserInfo = (user: FirebaseReducer.AuthState) =>
  isTruthy(user.displayName) && isTruthy(user.photoURL);

export type UserAvatarNameFields = Pick<BaseUser, "partyName" | "anonMode">;

export const getUserDisplayName = (user: UserAvatarNameFields) => {
  return user?.anonMode
    ? DEFAULT_PARTY_NAME
    : user?.partyName ?? DEFAULT_PARTY_NAME;
};
