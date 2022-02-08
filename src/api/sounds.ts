import Bugsnag from "@bugsnag/js";
import { FIREBASE } from "core/firebase";
import { collection, getDocs } from "firebase/firestore";

import { SoundConfig, SoundConfigMap, SoundConfigSchema } from "types/sounds";

import { withIdConverter } from "utils/converters";
import { errorForBugsnag } from "utils/error";

export const fetchSoundConfigs = async (): Promise<SoundConfigMap> => {
  try {
    const soundConfigs = await getDocs(
      collection(FIREBASE.firestore, "sounds")
        .withConverter({
          toFirestore: (soundConfig) =>
            SoundConfigSchema.validateSync(soundConfig),
          fromFirestore: (snapshot) =>
            SoundConfigSchema.validateSync(snapshot.data()),
        })
        .withConverter(withIdConverter<SoundConfig>())
    );

    return Object.fromEntries(
      soundConfigs.docs.map((snap) => [snap.id, snap.data()])
    );
  } catch (e) {
    Bugsnag.notify(errorForBugsnag(e), (event) => {
      event.addMetadata("context", {
        location: "api::sounds::fetchSoundConfigs",
      });
    });

    throw e;
  }
};
