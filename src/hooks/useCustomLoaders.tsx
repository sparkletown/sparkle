import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { DEFAULT_LOADER } from "settings";

import { CustomLoader } from "types/CustomLoader";

import { fetchCustomLoaders } from "api/loaders";

import {
  retrieveCustomLoaders as retrieveCachedCustomLoaders,
  storeCustomLoaders as cacheCustomLoaders,
} from "utils/localStorage";

export interface CustomLoadersState {
  customLoaders: CustomLoader[];
  chosenRandomLoader: CustomLoader;
  hasCustomLoaders: boolean;
}

export const initialValue: CustomLoadersState = {
  customLoaders: [],
  chosenRandomLoader: DEFAULT_LOADER,
  hasCustomLoaders: false, // Only true when the array isn't empty
};

export const CustomLoadersContext = createContext<CustomLoadersState>(
  initialValue
);

// @debt De-duplicate this with the version in utils/getRandomInt (that has a different definition)
const getRandomInt = (max: number, randomValue: () => number = Math.random) => {
  return Math.floor(randomValue() * Math.floor(max));
};

export const CustomLoadersProvider: React.FC = ({ children }) => {
  const [customLoaders, setCustomLoaders] = useState<CustomLoader[]>(
    retrieveCachedCustomLoaders()
  );

  // Fetch the loaders data on first load
  useEffect(() => {
    fetchCustomLoaders().then((loaders) => {
      setCustomLoaders(loaders);
      cacheCustomLoaders(loaders);
    });
  }, []);

  // Set the random integer once, but calculate how that maps to an index later
  // @debt Having this in the context like this will only choose the value once per full app load,
  //   which means we are always going to 'choose the same random loading screen' each time.
  //
  //   However, I believe we mostly only see the loading screen when we do a 'full new page load' at
  //   the moment, so I don't think this will be an issue in reality for now (since we're not using the
  //   routing helpers to change pages without a full reload in most places)
  //
  //   This works around a 'flashing bug' where the LoadingPage in the index.tsx shows one random element,
  //   then the LoadingPage in VenuePage.tsx chooses a different one. Because both occur so quickly after one
  //   another on first page load, it looks bad.
  const [rawRandomValue] = useState<number>(Math.random());

  const chosenRandomLoader: CustomLoader = useMemo(() => {
    if (customLoaders.length < 1) return DEFAULT_LOADER;

    const randomIndex = getRandomInt(
      customLoaders.length - 1,
      () => rawRandomValue
    );

    return customLoaders[randomIndex] ?? DEFAULT_LOADER;
  }, [rawRandomValue, customLoaders]);

  const providerData = useMemo(
    () => ({
      customLoaders,
      chosenRandomLoader,
      hasCustomLoaders: customLoaders.length > 0,
    }),
    [chosenRandomLoader, customLoaders]
  );

  return (
    <CustomLoadersContext.Provider value={providerData}>
      {children}
    </CustomLoadersContext.Provider>
  );
};

export const useCustomLoaders = (): CustomLoadersState =>
  useContext(CustomLoadersContext);
