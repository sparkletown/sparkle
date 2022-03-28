import { RetunableMediaElementSettings } from "components/attendee/RetunableMediaElement/types";
import firebase from "firebase/compat/app";

import { COLLECTION_RETUNABLE_MEDIA_ELEMENTS } from "settings";

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
