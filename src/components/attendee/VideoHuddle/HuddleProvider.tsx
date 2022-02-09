import React, { useState } from "react";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { VideoTrack } from "../VideoComms/types";

interface HuddleContextType {
  inHuddle: boolean;
  setInHuddle: (cb: (prevInHuddle: boolean) => void) => void;

  extraButtons: ButtonConfig[];
  setExtraButtons: (buttons: ButtonConfig[]) => void;
}

export type ButtonCallbackArgs = {
  track: VideoTrack;
};

export interface ButtonConfig {
  icon: IconDefinition;
  callback: (args: ButtonCallbackArgs) => void;
}

export const HuddleContext = React.createContext<HuddleContextType>({
  inHuddle: false,
  setInHuddle: (cb: (prevInHuddle: boolean) => void) => {},
  extraButtons: [],
  setExtraButtons: (buttons: ButtonConfig[]) => [],
});

interface HuddleProviderProps {
  children: React.ReactNode;
}

export const HuddleProvider: React.FC<HuddleProviderProps> = ({ children }) => {
  const [inHuddle, setInHuddle] = useState(false);

  const [extraButtons, setExtraButtons] = useState<ButtonConfig[]>([]);

  const contextState: HuddleContextType = {
    inHuddle,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    setInHuddle,
    extraButtons,
    setExtraButtons,
  };

  return (
    <HuddleContext.Provider value={contextState}>
      {children}
    </HuddleContext.Provider>
  );
};
