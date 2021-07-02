import React, { createContext, useContext, useMemo } from "react";

import { User } from "types/User";

import { WithId } from "utils/id";
import { worldUsersWithoutLocationSelector } from "utils/selectors";
import { isDefined } from "utils/types";

import { isLoaded, useFirestoreConnect } from "hooks/useFirestoreConnect";
import { useSelector } from "hooks/useSelector";
import { useSovereignVenueId } from "hooks/useSovereignVenueId";

export interface WorldUsersContextState {
  isSovereignVenueIdLoading: boolean;
  sovereignVenueId?: string;
  sovereignVenueIdError?: string;

  shouldConnect: boolean;
}

const WorldUsersContext = createContext<WorldUsersContextState | undefined>(
  undefined
);

export interface WorldUsersProviderProps {
  venueId?: string;
}

export const WorldUsersProvider: React.FC<WorldUsersProviderProps> = ({
  venueId,
  children,
}) => {
  const {
    sovereignVenueId,
    isSovereignVenueIdLoading,
    errorMsg: sovereignVenueIdError,
  } = useSovereignVenueId({
    venueId,
  });

  const shouldConnect =
    !isSovereignVenueIdLoading &&
    isDefined(sovereignVenueId) &&
    isDefined(venueId);

  // TODO: refactor this to not use useFirestoreConnect
  useFirestoreConnect(() => {
    if (!shouldConnect) return [];

    const relatedLocationIds = [venueId];

    if (sovereignVenueId) {
      relatedLocationIds.push(sovereignVenueId);
    }

    return [
      {
        collection: "users",
        where: ["enteredVenueIds", "array-contains-any", relatedLocationIds],
        storeAs: "worldUsers",
      },
    ];
  });

  const worldUsersState: WorldUsersContextState = useMemo(
    () => ({
      venueId,
      isSovereignVenueIdLoading,
      sovereignVenueId,
      sovereignVenueIdError,
      shouldConnect,
    }),
    [
      venueId,
      isSovereignVenueIdLoading,
      sovereignVenueId,
      sovereignVenueIdError,
      shouldConnect,
    ]
  );

  return (
    <WorldUsersContext.Provider value={worldUsersState}>
      {children}
    </WorldUsersContext.Provider>
  );
};

export const useWorldUsersContext = (): WorldUsersContextState => {
  const worldUsersState = useContext(WorldUsersContext);

  if (!worldUsersState) {
    throw new Error(
      "<WorldUsersProvider/> not found. Did you forget to include it in your component hierarchy?"
    );
  }

  return worldUsersState;
};

export interface WorldUsersData {
  worldUsers: readonly WithId<User>[];
  isWorldUsersLoaded: boolean;
}

export const useWorldUsers = (): WorldUsersData => {
  // We mostly use this here to ensure that the WorldUsersProvider has definitely been connected
  useWorldUsersContext();

  const selectedWorldUsers = useSelector(worldUsersWithoutLocationSelector);

  return useMemo(
    () => ({
      worldUsers: selectedWorldUsers ?? [],
      isWorldUsersLoaded: isLoaded(selectedWorldUsers),
    }),
    [selectedWorldUsers]
  );
};
