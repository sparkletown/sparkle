import React, { useState } from "react";

interface HuddleContextType {
  inHuddle: boolean;
  setInHuddle: React.Dispatch<React.SetStateAction<boolean>>;
}

export const HuddleContext = React.createContext<HuddleContextType>({
  inHuddle: false,
  setInHuddle: () => {},
});

export const HuddleProvider: React.FC = ({ children }) => {
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
