import firebase from "firebase/app";

export const fetchSovereignVenueId = async (
  venueId: string
): Promise<string> => {
  const venueDoc = await firebase
    .firestore()
    .collection("venues")
    .doc(venueId)
    .get();

  return new Promise<string>((resolve, reject) => {
    if (!venueDoc.exists) {
      reject("The venue doesn't exist");
      return;
    }

    const venue = venueDoc.data();

    if (!venue || !venueDoc.id) {
      reject("The venue doesn't have data or id");
      return;
    }

    if (!venue.parentId) {
      resolve(venueDoc.id);
    } else {
      resolve(fetchSovereignVenueId(venue.parentId));
    }
  });
};
