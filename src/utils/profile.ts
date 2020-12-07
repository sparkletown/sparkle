import firebase from "firebase/app";

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
