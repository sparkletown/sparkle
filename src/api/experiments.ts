import firebase from "firebase/compat/app";

import { COLLECTION_EXPERIMENTS } from "settings";

// This is a temporary API until we have something better. For now we use
// a collection "huddles" to store all this temporary data until we have a
// better place.

export const setProjectedVideoTrackId = async (
  huddleId: string,
  trackId: string | null
) => {
  firebase
    .firestore()
    .collection(COLLECTION_EXPERIMENTS)
    .doc(`projection-${huddleId}`)
    .set({ projectedVideoTrackId: trackId });
};
