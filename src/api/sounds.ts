import firebase from "firebase/app";

import { SoundConfig, SoundConfigSchema } from "types/sounds";

// TODO: do we want to just add sounds as part of the venue config..? That might make all of this easier to do.. At least while rooms exist on venue config still..
export const fetchSoundConfigs = async (): Promise<SoundConfig[]> => {
  const soundConfigsSnapshot = await firebase
    .firestore()
    .collection("sounds")
    .withConverter(soundConfigConverter)
    .get();

  return soundConfigsSnapshot.docs.map((d) => d.data());
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
