import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useAsync } from "react-use";

import { fetchRelatedVenues } from "api/venue";

import { ReactHook } from "types/utility";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { tracePromise } from "utils/performance";
import { isTruthy } from "utils/types";

import { useSovereignVenueId } from "./useSovereignVenueId";

const emptyArray: never[] = [];

export interface RelatedVenuesContextState {
  isLoading: boolean;
  isError: boolean;

  isSovereignVenueIdLoading: boolean;
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
    sovereignVenueId,
    isSovereignVenueIdLoading,
    errorMsg: sovereignVenueIdError,
  } = useSovereignVenueId({
    venueId,
  });

  const {
    loading: isRelatedVenuesLoading,
    error: relatedVenuesError,
    value: relatedVenues = emptyArray,
  } = useAsync(async () => {
    if (!sovereignVenueId) return emptyArray;

    return tracePromise(
      "RelatedVenuesProvider::fetchRelatedVenues",
      () => fetchRelatedVenues(sovereignVenueId),
      {
        attributes: {
          sovereignVenueId: sovereignVenueId,
        },
        withDebugLog: true,
      }
    );
  }, [sovereignVenueId]);

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
      isLoading: isSovereignVenueIdLoading || isRelatedVenuesLoading,
      isError: isTruthy(sovereignVenueIdError || relatedVenuesError),

      isSovereignVenueIdLoading,
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
      isSovereignVenueIdLoading,
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

  console.log({ relatedVenuesState, currentVenueId });

  return { ...relatedVenuesState, currentVenue, parentVenue };
};
