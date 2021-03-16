import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { SoundConfig } from "types/sounds";

import { fetchSoundConfigs } from "api/sounds";

export interface CustomSoundsState {
  soundConfigs: SoundConfig[];
}

export const initialValue: CustomSoundsState = {
  soundConfigs: [],
};

export const CustomSoundsContext = createContext<CustomSoundsState>(
  initialValue
);

export const CustomSoundsProvider: React.FC = ({ children }) => {
  const [soundConfigs, setSoundConfigs] = useState<SoundConfig[]>([]);

  // Fetch the sound configs data on first load
  useEffect(() => {
    fetchSoundConfigs().then((soundConfigs) => {
      setSoundConfigs(soundConfigs);
    });
  }, []);

  const providerData = useMemo(
    () => ({
      soundConfigs,
    }),
    [soundConfigs]
  );

  return (
    <CustomSoundsContext.Provider value={providerData}>
      {children}
    </CustomSoundsContext.Provider>
  );
};

export const useCustomSounds = (): CustomSoundsState =>
  useContext(CustomSoundsContext);
