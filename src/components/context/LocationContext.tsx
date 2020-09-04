import React, { useState } from "react";

type Location = { x: number; y: number };

interface LocationContextType {
  location: Location | undefined;
  setLocation: (location: Location) => void;
}

export const LocationContext = React.createContext<
  LocationContextType | undefined
>(undefined);

export const LocationContextWrapper: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [location, setLocation] = useState<Location>();
  const store = { location, setLocation };

  return (
    <LocationContext.Provider value={store}>
      {children}
    </LocationContext.Provider>
  );
};
