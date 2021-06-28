import firebase from "firebase/app";
import { get } from "lodash";
import { FirebaseReducer } from "react-redux-firebase";

import { User, Mappings } from "types/User";

import { isTruthy } from "./types";
import { isDefined } from "utils/types";

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

export const getMappedValues = (mappings: Mappings, source: Object) =>
  Object.entries(mappings).reduce((acc, [name, path]) => {
    const mappingValue: string = get(source, path);

    if (!isDefined(mappingValue)) {
      return acc;
    }

    return { ...acc, [name]: mappingValue };
  }, {});
