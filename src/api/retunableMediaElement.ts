import { RetunableMediaElementSettings } from "components/attendee/RetunableMediaElement/RetunableMediaElement.types";
import firebase from "firebase/compat/app";

import { COLLECTION_RETUNABLE_MEDIA_ELEMENTS } from "settings";

import { SpaceId } from "types/id";

import { createErrorCapture } from "utils/error";

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
    .set(settings)
    .catch(
      createErrorCapture({
        message: `Unable to set re-tunable media settings for space ${spaceId}`,
        where: "setRetunableMediaSettings",
        args: { settings },
      })
    );
};
