import React, { useState } from "react";

interface HuddleContextType {
  inHuddle: string | undefined;
  setInHuddle: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const HuddleContext = React.createContext<HuddleContextType>({
  inHuddle: undefined,
  setInHuddle: () => {},
});

export const HuddleProvider: React.FC = ({ children }) => {
  const [inHuddle, setInHuddle] = useState<string>();

  const contextState: HuddleContextType = {
    inHuddle,
    setInHuddle,
  };

  return (
    <HuddleContext.Provider value={contextState}>
      {children}
    </HuddleContext.Provider>
  );
};
