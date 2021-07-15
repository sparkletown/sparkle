import React, { createContext, useContext, useMemo, useCallback } from "react";

import { SparkleSelector } from "types/SparkleSelector";
import { ReactHook } from "types/utility";
import { AnyVenue } from "types/venues";

import { WithId, withId } from "utils/id";

import { useFirestoreConnect, isLoaded } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";

export const administeredVenuesSelector: SparkleSelector<
  Record<string, AnyVenue> | undefined
> = (state) => state.firestore.data.administeredVenues;

export const useConnectAdministeredVenues = (userId?: string) => {
  useFirestoreConnect(
    userId
      ? {
          collection: "venues",
          where: [["owners", "array-contains", userId]],
          storeAs: "administeredVenues",
        }
      : undefined
  );
};

export interface AdministeredVenuesContextState {
  isLoaded: boolean;
  isLoading: boolean;

  administeredVenues: WithId<AnyVenue>[];
  administeredVenuesIds: string[];

  findVenueInAdministeredVenues: (
    searchedForVenueId: string
  ) => WithId<AnyVenue> | undefined;
}

const AdministeredVenuesContext = createContext<
  AdministeredVenuesContextState | undefined
>(undefined);

export interface AdministeredVenuesProviderProps {
  userId?: string;
}

export const AdministeredVenuesProvider: React.FC<AdministeredVenuesProviderProps> = ({
  children,
  userId,
}) => {
  useConnectAdministeredVenues(userId);

  const venues = useSelector(administeredVenuesSelector);

  const administeredVenues = useMemo(
    () => Object.entries(venues ?? {}).map(([id, venue]) => withId(venue, id)),
    [venues]
  );

  const administeredVenuesIds = useMemo(() => Object.keys(venues ?? {}), [
    venues,
  ]);

  const findVenueInAdministeredVenues = useCallback(
    (searchedForVenueId: string): WithId<AnyVenue> | undefined =>
      administeredVenues.find((venue) => venue.id === searchedForVenueId),
    [administeredVenues]
  );

  const administeredVenuesState: AdministeredVenuesContextState = useMemo(
    () => ({
      isLoaded: isLoaded(venues),
      isLoading: !isLoaded(venues),

      administeredVenues,
      administeredVenuesIds,

      findVenueInAdministeredVenues,
    }),
    [
      venues,
      administeredVenues,
      administeredVenuesIds,
      findVenueInAdministeredVenues,
    ]
  );

  return (
    <AdministeredVenuesContext.Provider value={administeredVenuesState}>
      {children}
    </AdministeredVenuesContext.Provider>
  );
};

export const useAdministeredVenuesContext = (): AdministeredVenuesContextState => {
  const administeredVenuesState = useContext(AdministeredVenuesContext);

  if (!administeredVenuesState) {
    throw new Error(
      "<AdministeredVenuesProvider/> not found. Did you forget to include it in your component hierarchy?"
    );
  }

  return administeredVenuesState;
};

export interface AdministeredProps extends AdministeredVenuesProviderProps {
  currentVenueId?: string;
}

export interface AdministeredData extends AdministeredVenuesContextState {
  currentVenue?: WithId<AnyVenue>;
}

export const useAdministeredVenues: ReactHook<
  AdministeredProps,
  AdministeredData
> = ({ currentVenueId }): AdministeredData => {
  const administeredVenuesState = useAdministeredVenuesContext();

  const { findVenueInAdministeredVenues } = administeredVenuesState;

  const currentVenue: WithId<AnyVenue> | undefined = useMemo(
    () =>
      currentVenueId
        ? findVenueInAdministeredVenues(currentVenueId)
        : undefined,
    [currentVenueId, findVenueInAdministeredVenues]
  );

  return {
    ...administeredVenuesState,
    currentVenue,
  };
};
