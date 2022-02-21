import React, { useState } from "react";

interface HuddleContextType {
  inHuddle: boolean;
  setInHuddle: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HuddleContext = React.createContext<HuddleContextType>({
  inHuddle: false,
  setInHuddle: () => {},
});

interface HuddleProviderProps {
  children: React.ReactNode;
}

export const HuddleProvider: React.FC<HuddleProviderProps> = ({ children }) => {
  const [inHuddle, setInHuddle] = useState(false);

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
