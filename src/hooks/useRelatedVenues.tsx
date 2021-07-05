import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useAsync } from "react-use";

import { fetchRelatedVenues } from "api/venue";

import { ReactHook } from "types/utility";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { tracePromise } from "utils/performance";
import { isTruthy } from "utils/types";

import { useSovereignVenue } from "./useSovereignVenue";

const emptyArray: never[] = [];

export interface RelatedVenuesContextState {
  isLoading: boolean;
  isError: boolean;

  isSovereignVenueLoading: boolean;
  sovereignVenue?: WithId<AnyVenue>;
  sovereignVenueId?: string;

  sovereignVenueIdError?: string;

  isRelatedVenuesLoading: boolean;
  relatedVenues: WithId<AnyVenue>[];
  relatedVenueIds: string[];
  relatedVenuesError?: Error;

  findVenueInRelatedVenues: (
    searchedForVenueId?: string
  ) => WithId<AnyVenue> | undefined;
}

const RelatedVenuesContext = createContext<
  RelatedVenuesContextState | undefined
>(undefined);

export interface RelatedVenuesProviderProps {
  venueId?: string;
}

export const RelatedVenuesProvider: React.FC<RelatedVenuesProviderProps> = ({
  venueId,
  children,
}) => {
  const {
    sovereignVenue,
    sovereignVenueId,
    isSovereignVenueLoading,
    errorMsg: sovereignVenueIdError,
  } = useSovereignVenue({
    venueId,
  });

  const {
    loading: isRelatedVenuesLoading,
    error: relatedVenuesError,
    value: relatedVenues = emptyArray,
  } = useAsync(async () => {
    if (!sovereignVenueId || !sovereignVenue) return emptyArray;

    return tracePromise(
      "RelatedVenuesProvider::fetchRelatedVenues",
      () => fetchRelatedVenues(sovereignVenue),
      {
        attributes: { sovereignVenueId },
        withDebugLog: true,
      }
    );
  }, [sovereignVenueId, sovereignVenue]);

  const relatedVenueIds = useMemo(
    () => relatedVenues.map((venue) => venue.id),
    [relatedVenues]
  );

  const findVenueInRelatedVenues = useCallback(
    (searchedForVenueId?: string): WithId<AnyVenue> | undefined => {
      if (!relatedVenues) return;

      return relatedVenues.find((venue) => venue.id === searchedForVenueId);
    },
    [relatedVenues]
  );

  const relatedVenuesState: RelatedVenuesContextState = useMemo(
    () => ({
      isLoading: isSovereignVenueLoading || isRelatedVenuesLoading,
      isError: isTruthy(sovereignVenueIdError || relatedVenuesError),

      isSovereignVenueLoading,
      sovereignVenue: findVenueInRelatedVenues(sovereignVenueId),
      sovereignVenueId,
      sovereignVenueIdError,

      isRelatedVenuesLoading,
      relatedVenues,
      relatedVenueIds,
      relatedVenuesError,

      findVenueInRelatedVenues,
    }),
    [
      findVenueInRelatedVenues,
      isRelatedVenuesLoading,
      isSovereignVenueLoading,
      relatedVenues,
      relatedVenueIds,
      relatedVenuesError,
      sovereignVenueId,
      sovereignVenueIdError,
    ]
  );

  return (
    <RelatedVenuesContext.Provider value={relatedVenuesState}>
      {children}
    </RelatedVenuesContext.Provider>
  );
};

export const useRelatedVenuesContext = (): RelatedVenuesContextState => {
  const relatedVenuesState = useContext(RelatedVenuesContext);

  if (!relatedVenuesState) {
    throw new Error(
      "<RelatedVenuesProvider/> not found. Did you forget to include it in your component hierarchy?"
    );
  }

  return relatedVenuesState;
};

export interface RelatedVenuesProps {
  currentVenueId?: string;
}

export interface RelatedVenuesData extends RelatedVenuesContextState {
  parentVenue?: WithId<AnyVenue>;
  currentVenue?: WithId<AnyVenue>;
}

export const useRelatedVenues: ReactHook<
  RelatedVenuesProps,
  RelatedVenuesData
> = ({ currentVenueId }): RelatedVenuesData => {
  const relatedVenuesState = useRelatedVenuesContext();

  const { findVenueInRelatedVenues } = relatedVenuesState;

  const currentVenue: WithId<AnyVenue> | undefined = useMemo(() => {
    return findVenueInRelatedVenues(currentVenueId);
  }, [currentVenueId, findVenueInRelatedVenues]);

  const parentVenue: WithId<AnyVenue> | undefined = useMemo(() => {
    if (!currentVenue) return;

    return findVenueInRelatedVenues(currentVenue.parentId);
  }, [currentVenue, findVenueInRelatedVenues]);

  return { ...relatedVenuesState, currentVenue, parentVenue };
};
