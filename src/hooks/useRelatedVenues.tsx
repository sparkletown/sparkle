import React, { createContext, useCallback, useContext, useMemo } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { AnyVenue, SpaceSlug } from "types/venues";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";
import { findSovereignVenue } from "utils/venue";

import { isEmpty } from "./useFirestoreConnect";

export type FindVenueInRelatedVenuesOptions = {
  spaceId?: string;
  spaceSlug?: SpaceSlug;
};

export interface RelatedVenuesContextState {
  isLoading: boolean;

  sovereignVenue?: WithId<AnyVenue>;
  sovereignVenueId?: string;
  sovereignVenueDescendantIds?: readonly string[];

  relatedVenues: WithId<AnyVenue>[];
  descendantVenues: WithId<AnyVenue>[];
  relatedVenueIds: string[];
  relatedSpaceSlugs: SpaceSlug[];

  findVenueInRelatedVenues: (
    searchOptions: FindVenueInRelatedVenuesOptions
  ) => WithId<AnyVenue> | undefined;
}

const RelatedVenuesContext = createContext<
  RelatedVenuesContextState | undefined
>(undefined);

export interface RelatedVenuesProviderProps {
  venueId?: string;
  worldId?: string;
}

export const RelatedVenuesProvider: React.FC<RelatedVenuesProviderProps> = ({
  venueId,
  worldId,
  children,
}) => {
  const firestore = useFirestore();
  const relatedVenuesRef = firestore
    .collection("venues")
    .where("worldId", "==", worldId ?? "")
    .withConverter(withIdConverter<AnyVenue>());

  const { data: relatedVenues } = useFirestoreCollectionData<WithId<AnyVenue>>(
    relatedVenuesRef,
    {
      initialData: ALWAYS_EMPTY_ARRAY,
    }
  );

  const sovereignVenueSearchResult = useMemo(() => {
    if (!venueId || isEmpty(relatedVenues)) return;

    return findSovereignVenue(venueId, relatedVenues);
  }, [venueId, relatedVenues]);

  const sovereignVenue = sovereignVenueSearchResult?.sovereignVenue;
  const sovereignVenueDescendantIds =
    sovereignVenueSearchResult?.checkedVenueIds;
  const sovereignVenueId = sovereignVenue?.id;

  const relatedVenueIds = useMemo(
    () => relatedVenues.map((venue) => venue.id),
    [relatedVenues]
  );

  const relatedSpaceSlugs = useMemo(
    () => relatedVenues.map((venue) => venue.slug),
    [relatedVenues]
  );

  const descendantVenues = useMemo(
    () => relatedVenues.filter((venue) => venue.id !== sovereignVenueId),
    [relatedVenues, sovereignVenueId]
  );

  const findVenueInRelatedVenues = useCallback(
    (
      searchOptions: FindVenueInRelatedVenuesOptions
    ): WithId<AnyVenue> | undefined => {
      if (!searchOptions) return;

      if (searchOptions.spaceSlug) {
        const foundSpace = relatedVenues.find(
          (space) => space.slug === searchOptions.spaceSlug
        );
        if (foundSpace) {
          return foundSpace;
        }
      }

      if (searchOptions.spaceId) {
        const foundSpace = relatedVenues.find(
          (space) => space.id === searchOptions.spaceId
        );
        if (foundSpace) {
          return foundSpace;
        }
      }

      return undefined;
    },
    [relatedVenues]
  );

  const relatedVenuesState: RelatedVenuesContextState = useMemo(
    () => ({
      isLoading: false,

      sovereignVenue,
      sovereignVenueId,
      sovereignVenueDescendantIds,

      relatedVenues,
      relatedVenueIds,
      relatedSpaceSlugs,

      descendantVenues,

      findVenueInRelatedVenues,
    }),
    [
      relatedVenues,
      relatedVenueIds,
      relatedSpaceSlugs,
      descendantVenues,
      findVenueInRelatedVenues,
      sovereignVenue,
      sovereignVenueId,
      sovereignVenueDescendantIds,
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
    return findVenueInRelatedVenues({ spaceId: currentVenueId });
  }, [currentVenueId, findVenueInRelatedVenues]);

  const parentVenue: WithId<AnyVenue> | undefined = useMemo(() => {
    if (!currentVenue) return;

    return findVenueInRelatedVenues({ spaceId: currentVenue.parentId });
  }, [currentVenue, findVenueInRelatedVenues]);

  const parentVenueId = parentVenue?.id;

  if (!props) {
    return relatedVenuesState;
  }

  return { ...relatedVenuesState, currentVenue, parentVenue, parentVenueId };
}
