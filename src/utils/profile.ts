import firebase from "firebase/app";
import { FirebaseReducer } from "react-redux-firebase";

import { User } from "types/User";

import { isTruthy } from "./types";

export const updateProfileEnteredVenueIds = async (
  prevEnteredVenueIds: readonly string[] | undefined,
  userId: string | undefined,
  venueId: string
) => {
  const enteredVenueIds = prevEnteredVenueIds ? [...prevEnteredVenueIds] : [];
  if (!enteredVenueIds.includes(venueId)) {
    enteredVenueIds.push(venueId);
    await firebase
      .firestore()
      .collection("users")
      .doc(userId)
      .update({ enteredVenueIds });
  }
};

export const isCompleteProfile = (profile: FirebaseReducer.Profile<User>) =>
  isTruthy(profile.partyName) && isTruthy(profile.pictureUrl);
