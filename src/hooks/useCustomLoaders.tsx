import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import firebase from "firebase/app";

import { CustomLoader, isCustomLoader } from "types/CustomLoader";

export interface CustomLoadersState {
  customLoaders: CustomLoader[];
}

export const initialValue: CustomLoadersState = {
  customLoaders: [],
};

export const CustomLoadersContext = createContext<CustomLoadersState>(
  initialValue
);

export const CustomLoadersProvider: React.FC = ({ children }) => {
  const [customLoaders, setCustomLoaders] = useState<CustomLoader[]>([]);

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
    })();
  }, []);

  const providerData = useMemo(
    () => ({
      customLoaders,
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
