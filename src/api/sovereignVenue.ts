import firebase from "firebase/app";

export const fetchSovereignVenueId = async (
  venueId: string
): Promise<string> => {
  const venueDoc = await firebase
    .firestore()
    .collection("venues")
    .doc(venueId)
    .get();

  if (!venueDoc.exists) {
    throw new Error("The venue doesn't exist");
  }

  const venue = venueDoc.data();

  if (!venue || !venueDoc.id) {
    throw new Error("The venue doesn't have data or id");
  }

  if (!venue.parentId) {
    return venueDoc.id;
  } else {
    return fetchSovereignVenueId(venue.parentId);
  }
};
