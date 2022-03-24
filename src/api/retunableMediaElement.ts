import { RetunableMediaElementSettings } from "components/attendee/RetunableMediaElement/types";
import firebase from "firebase/compat/app";

import { COLLECTION_RETUNABLE_MEDIA_ELEMENTS } from "settings";

// This is a temporary API until we have something better. For now we use
// a collection "huddles" to store all this temporary data until we have a
// better place.

export const setRetunableMediaSettings = async (
  spaceId: string,
  settings: RetunableMediaElementSettings
) => {
  firebase
    .firestore()
    .collection(COLLECTION_RETUNABLE_MEDIA_ELEMENTS)
    .doc(spaceId)
    .set(settings);
};
