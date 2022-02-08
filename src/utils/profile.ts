import { getUserRef } from "api/profile";

import { Profile } from "types/User";

import { isTruthy } from "./types";

export const updateProfileEnteredVenueIds = async (
  prevEnteredVenueIds: readonly string[] | undefined,
  userId: string | undefined,
  venueId: string
) => {
  const enteredVenueIds = prevEnteredVenueIds ? [...prevEnteredVenueIds] : [];
  if (!enteredVenueIds.includes(venueId) && userId) {
    enteredVenueIds.push(venueId);
    await getUserRef(userId).update({ enteredVenueIds });
  }
};

export const updateProfileEnteredWorldIds = async (
  prevEnteredWorldIds: readonly string[] | undefined,
  userId: string | undefined,
  worldId: string
) => {
  const enteredWorldIds = prevEnteredWorldIds ? [...prevEnteredWorldIds] : [];
  if (!enteredWorldIds.includes(worldId) && userId) {
    enteredWorldIds.push(worldId);
    await getUserRef(userId).update({ enteredWorldIds });
  }
};

export const isCompleteProfile = (profile: Profile | null | undefined) =>
  isTruthy(profile?.partyName) && isTruthy(profile?.pictureUrl);
