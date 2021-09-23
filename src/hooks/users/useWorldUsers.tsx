import React, { createContext, useContext, useMemo } from "react";
import { skipToken } from "@reduxjs/toolkit/query/react";

import { useWorldUsersQuery, WorldUsersApiArgs } from "store/api/worldUsers";

import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useUser } from "hooks/useUser";

export interface WorldUsersContextState {
  isSovereignVenueIdLoading: boolean;
  sovereignVenueId?: string;

  worldUsersApiArgs?: WorldUsersApiArgs;
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
    isLoading: isSovereignVenueLoading,
  } = useRelatedVenues();

  const { userId } = useUser();

  const relatedLocationIds: string[] | undefined = useMemo(() => {
    if (isSovereignVenueLoading || !venueId || !sovereignVenueId) return;

    return [sovereignVenueId, venueId];
  }, [isSovereignVenueLoading, sovereignVenueId, venueId]);

  // TODO: should we refactor this to use useWorldUsersQuerySubscription rather than connecting it to receive data updates?
  //   It seems that useWorldUsersQuerySubscription doesn't return originalArgs, so we can't use it in the same way
  //   as we are currently doing things.. but we could potentially just pass the same args object into the hook as what we pass
  //   down for the descendant code to use.. which would work around that 'limitation'
  // TODO: https://redux-toolkit.js.org/rtk-query/usage/queries#selecting-data-from-a-query-result
  const { originalArgs: worldUsersApiArgs } = useWorldUsersQuery(
    relatedLocationIds && userId
      ? { relatedLocationIds, currentUserId: userId }
      : skipToken,
    {
      selectFromResult: ({ originalArgs }) => ({ originalArgs }),
    }
  );

  const worldUsersState: WorldUsersContextState = useMemo(
    () => ({
      venueId,
      isSovereignVenueIdLoading: isSovereignVenueLoading,
      sovereignVenueId,
      worldUsersApiArgs,
    }),
    [venueId, isSovereignVenueLoading, sovereignVenueId, worldUsersApiArgs]
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
