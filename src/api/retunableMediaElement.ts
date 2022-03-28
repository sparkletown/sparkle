import { RetunableMediaElementSettings } from "components/attendee/RetunableMediaElement/RetunableMediaElement.types";
import firebase from "firebase/compat/app";

import { COLLECTION_RETUNABLE_MEDIA_ELEMENTS } from "settings";

import { SpaceId } from "types/id";

type SetRetunableMediaSettings = (options: {
  spaceId: SpaceId;
  settings: RetunableMediaElementSettings;
}) => Promise<void>;

export const setRetunableMediaSettings: SetRetunableMediaSettings = async ({
  spaceId,
  settings,
}) => {
  firebase
    .firestore()
    .collection(COLLECTION_RETUNABLE_MEDIA_ELEMENTS)
    .doc(spaceId)
    .set(settings);
};
