import firebase from "firebase/app";

import { CustomLoader, isCustomLoader } from "types/CustomLoader";

export const fetchCustomLoaders = async (): Promise<CustomLoader[]> => {
  const loadersSnapshot = await firebase
    .firestore()
    .collection("loaders")
    .get();

  return loadersSnapshot.docs.map((d) => d.data()).filter(isCustomLoader);
};
