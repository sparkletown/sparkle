import React, { createContext, useCallback, useContext, useMemo } from "react";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { relatedVenuesSelector } from "utils/selectors";
import { getSovereignVenue } from "utils/venue";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";

const emptyArray: never[] = [];

export interface RelatedVenuesContextState {
  isLoading: boolean;

  sovereignVenue?: WithId<AnyVenue>;
  sovereignVenueId?: string;
  checkedVenueIds?: readonly string[];

  relatedVenues: WithId<AnyVenue>[];
  descendantVenues: WithId<AnyVenue>[];
  relatedVenueIds: string[];

  findVenueInRelatedVenues: (
    searchedForVenueId?: string
  ) => WithId<AnyVenue> | undefined;
}

const RelatedVenuesContext = createContext<
  RelatedVenuesContextState | undefined
>(undefined);

export interface RelatedVenuesProviderProps {
  venue?: WithId<AnyVenue>;
}

export const RelatedVenuesProvider: React.FC<RelatedVenuesProviderProps> = ({
  venue,
  children,
}) => {
  const venueId = venue?.id;
  const worldId = venue?.worldId;

  // @debt rewrite this the way users are implemented, but without the batching
  useFirestoreConnect(() => {
    if (!worldId) return [];

    return [
      {
        collection: "venues",
        where: ["worldId", "==", worldId],
        storeAs: "relatedVenues",
      },
    ];
  });

  // @debt rewrite this the way users are implemented, but without the batching
  const relatedVenues = useSelector(relatedVenuesSelector) ?? emptyArray;

  const hasRelatedVenues = relatedVenues.length > 0;

  const sovereignVenueSearchResult = useMemo(() => {
    if (!venueId || !hasRelatedVenues) return;

    return getSovereignVenue(venueId, relatedVenues);
  }, [venueId, relatedVenues, hasRelatedVenues]);

  const sovereignVenue = sovereignVenueSearchResult?.sovereignVenue;
  const checkedVenueIds = sovereignVenueSearchResult?.checkedVenueIds;
  const sovereignVenueId = sovereignVenue?.id;

  const relatedVenueIds = useMemo(
    () => relatedVenues.map((venue) => venue.id),
    [relatedVenues]
  );

  const descendantVenues = useMemo(
    () => relatedVenues.filter((venue) => venue.id !== sovereignVenueId),
    [relatedVenues, sovereignVenueId]
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
      isLoading: !isLoaded(relatedVenues),

      sovereignVenue,
      sovereignVenueId,
      checkedVenueIds,

      relatedVenues,
      relatedVenueIds,

      descendantVenues,

      findVenueInRelatedVenues,
    }),
    [
      relatedVenues,
      relatedVenueIds,
      descendantVenues,
      findVenueInRelatedVenues,
      sovereignVenue,
      sovereignVenueId,
      checkedVenueIds,
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
  parentVenueId?: string;
}

export function useRelatedVenues(props: RelatedVenuesProps): RelatedVenuesData;
export function useRelatedVenues(): RelatedVenuesContextState;

// eslint-disable-next-line func-style, prefer-arrow/prefer-arrow-functions
export function useRelatedVenues(props?: RelatedVenuesProps) {
  const { currentVenueId } = props ?? {};
  const relatedVenuesState = useRelatedVenuesContext();

  const { findVenueInRelatedVenues } = relatedVenuesState;

  const currentVenue: WithId<AnyVenue> | undefined = useMemo(() => {
    return findVenueInRelatedVenues(currentVenueId);
  }, [currentVenueId, findVenueInRelatedVenues]);

  const parentVenue: WithId<AnyVenue> | undefined = useMemo(() => {
    if (!currentVenue) return;

    return findVenueInRelatedVenues(currentVenue.parentId);
  }, [currentVenue, findVenueInRelatedVenues]);

  const parentVenueId = parentVenue?.id;

  if (!props) {
    return relatedVenuesState;
  }

  return { ...relatedVenuesState, currentVenue, parentVenue, parentVenueId };
}
