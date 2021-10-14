import { FirebaseReducer } from "react-redux-firebase";

import { getUserRef } from "api/profile";

import { User } from "types/User";

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

export const isCompleteProfile = (profile: FirebaseReducer.Profile<User>) =>
  isTruthy(profile.partyName) && isTruthy(profile.pictureUrl);
