import firebase from "firebase/app";

export const fetchSovereignVenueId = (
  venueId: string,
  onSuccess: (sovereignVenueId: string) => void,
  onError: () => void
) => {
  const firestore = firebase.firestore();

  firestore
    .collection("venues")
    .doc(venueId)
    .get()
    .then(async (doc) => {
      if (!doc.exists) {
        onError();
        return;
      }

      const venue = doc.data();

      if (!venue || !doc.id) {
        onError();
        return;
      }

      if (!venue.parentId) {
        onSuccess(doc.id);
      } else {
        fetchSovereignVenueId(venue.parentId, onSuccess, onError);
      }
    })
    .catch((err) => {
      onError();
    });
};
