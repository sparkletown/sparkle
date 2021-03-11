import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import firebase from "firebase/app";

import { CustomLoader, isCustomLoader } from "types/CustomLoader";

import {
  retrieveCustomLoaders as retrieveCachedCustomLoaders,
  storeCustomLoaders as cacheCustomLoaders,
} from "utils/localStorage";

export interface CustomLoadersState {
  customLoaders: CustomLoader[];
  hasCustomLoaders: boolean;
}

export const initialValue: CustomLoadersState = {
  customLoaders: [],
  hasCustomLoaders: false,
};

export const CustomLoadersContext = createContext<CustomLoadersState>(
  initialValue
);

export const CustomLoadersProvider: React.FC = ({ children }) => {
  const [customLoaders, setCustomLoaders] = useState<CustomLoader[]>(
    retrieveCachedCustomLoaders()
  );

  // Fetch the loaders data on first load
  useEffect(() => {
    (async () => {
      const loadersSnapshot = await firebase
        .firestore()
        .collection("loaders")
        .get();

      const loaders: CustomLoader[] = loadersSnapshot.docs
        .map((d) => d.data())
        .filter(isCustomLoader);

      setCustomLoaders(loaders);
      cacheCustomLoaders(loaders);
    })();
  }, []);

  const providerData = useMemo(
    () => ({
      customLoaders,
      hasCustomLoaders: customLoaders.length > 0,
    }),
    [customLoaders]
  );

  return (
    <CustomLoadersContext.Provider value={providerData}>
      {children}
    </CustomLoadersContext.Provider>
  );
};

export const useCustomLoaders = (): CustomLoadersState =>
  useContext(CustomLoadersContext);
