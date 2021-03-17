import firebase from "firebase/app";
import Bugsnag from "@bugsnag/js";

import { SoundConfig, SoundConfigMap, SoundConfigSchema } from "types/sounds";

import { withId } from "utils/id";
import { itemsToObjectByIdReducer } from "utils/reducers";

export const fetchSoundConfigs = async (): Promise<SoundConfigMap> => {
  try {
    const soundConfigsSnapshot = await firebase
      .firestore()
      .collection("sounds")
      .withConverter(soundConfigConverter)
      .get();

    return soundConfigsSnapshot.docs
      .map((docSnapshot) => withId(docSnapshot.data(), docSnapshot.id))
      .reduce(itemsToObjectByIdReducer, {});
  } catch (err) {
    Bugsnag.notify(err, (event) => {
      event.addMetadata("context", {
        location: "api::sounds::fetchSoundConfigs",
      });
    });

    return {};
  }
};

/**
 * Convert SoundConfig objects between the app/firestore formats, including validation.
 */
export const soundConfigConverter: firebase.firestore.FirestoreDataConverter<SoundConfig> = {
  toFirestore: (soundConfig: SoundConfig): firebase.firestore.DocumentData => {
    return SoundConfigSchema.validateSync(soundConfig);
  },
  fromFirestore: (
    snapshot: firebase.firestore.QueryDocumentSnapshot
  ): SoundConfig => {
    return SoundConfigSchema.validateSync(snapshot.data());
  },
};
