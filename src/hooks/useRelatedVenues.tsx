import React, { createContext, useCallback, useContext, useMemo } from "react";
import { where } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  COLLECTION_SPACES,
  FIELD_IS_HIDDEN,
  FIELD_WORLD_ID,
} from "settings";

import {
  SpaceId,
  SpaceSlug,
  SpaceWithId,
  WorldAndSpaceIdLocation,
  WorldIdLocation,
} from "types/id";

import { convertToFirestoreKey } from "utils/id";
import { isDefined } from "utils/types";
import { findSovereignVenue } from "utils/venue";

import { useRefiCollection } from "hooks/fire/useRefiCollection";
import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

export type FindVenueInRelatedVenuesOptions = {
  spaceId?: SpaceId;
  spaceSlug?: SpaceSlug;
};

export interface RelatedVenuesContextState {
  isLoading: boolean;

  sovereignVenue?: SpaceWithId;
  sovereignVenueId?: string;

  worldSpaces: SpaceWithId[];
  relatedVenueIds: string[];

  findVenueInRelatedVenues: (
    searchOptions: FindVenueInRelatedVenuesOptions
  ) => SpaceWithId | undefined;
}

const RelatedVenuesContext = createContext<
  RelatedVenuesContextState | undefined
>(undefined);

const LegacyRelatedVenuesProvider: React.FC<WorldAndSpaceIdLocation> = ({
  spaceId,
  worldId,
  children,
}) => {
  const { data, isLoading } = useRefiCollection<SpaceWithId>({
    path: [COLLECTION_SPACES],
    constraints: [
      where(FIELD_WORLD_ID, "==", convertToFirestoreKey(worldId)),
      where(FIELD_IS_HIDDEN, "==", false),
    ],
  });

  const worldSpaces = data ?? ALWAYS_EMPTY_ARRAY;

  const sovereignVenueSearchResult = useMemo(() => {
    if (!spaceId || !Array.isArray(worldSpaces) || !worldSpaces.length) {
      return;
    }

    return findSovereignVenue(spaceId, worldSpaces);
  }, [spaceId, worldSpaces]);

  const sovereignVenue = sovereignVenueSearchResult?.sovereignVenue;

  const relatedVenueIds = useMemo(() => worldSpaces.map((venue) => venue.id), [
    worldSpaces,
  ]);

  const findVenueInRelatedVenues = useCallback(
    (
      searchOptions: FindVenueInRelatedVenuesOptions
    ): SpaceWithId | undefined => {
      if (!searchOptions) return;

      if (searchOptions.spaceSlug) {
        const foundSpace = worldSpaces.find(
          (space) => space.slug === searchOptions.spaceSlug
        );
        if (foundSpace) {
          return foundSpace;
        }
      }

      if (searchOptions.spaceId) {
        const foundSpace = worldSpaces.find(
          (space) => space.id === searchOptions.spaceId
        );
        if (foundSpace) {
          return foundSpace;
        }
      }

      return undefined;
    },
    [worldSpaces]
  );

  const relatedVenuesState: RelatedVenuesContextState = useMemo(
    () => ({
      isLoading,

      sovereignVenue,

      worldSpaces,
      relatedVenueIds,

      findVenueInRelatedVenues,
    }),
    [
      isLoading,
      worldSpaces,
      relatedVenueIds,
      findVenueInRelatedVenues,
      sovereignVenue,
    ]
  );

  return (
    <RelatedVenuesContext.Provider value={relatedVenuesState}>
      {children}
    </RelatedVenuesContext.Provider>
  );
};

const WorldSpacesProvider: React.FC<WorldIdLocation> = ({
  worldId,
  children,
}) => {
  const { data, isLoading } = useRefiCollection<SpaceWithId>({
    path: [COLLECTION_SPACES],
    constraints: [
      where(FIELD_WORLD_ID, "==", convertToFirestoreKey(worldId)),
      where(FIELD_IS_HIDDEN, "==", false),
    ],
  });

  const worldSpaces = data?.filter(isDefined) ?? ALWAYS_EMPTY_ARRAY;

  const relatedVenueIds = useMemo(() => worldSpaces.map(({ id }) => id), [
    worldSpaces,
  ]);

  const findVenueInRelatedVenues = useCallback(
    (
      searchOptions: FindVenueInRelatedVenuesOptions
    ): SpaceWithId | undefined => {
      if (!searchOptions) return;

      if (searchOptions.spaceSlug) {
        const foundSpace = worldSpaces.find(
          (space) => space.slug === searchOptions.spaceSlug
        );
        if (foundSpace) {
          return foundSpace;
        }
      }

      if (searchOptions.spaceId) {
        const foundSpace = worldSpaces.find(
          (space) => space.id === searchOptions.spaceId
        );
        if (foundSpace) {
          return foundSpace;
        }
      }

      return undefined;
    },
    [worldSpaces]
  );

  const relatedVenuesState: RelatedVenuesContextState = useMemo(
    () => ({
      isLoading,
      worldSpaces,
      relatedVenueIds,
      findVenueInRelatedVenues,
    }),
    [isLoading, worldSpaces, relatedVenueIds, findVenueInRelatedVenues]
  );

  return (
    <RelatedVenuesContext.Provider value={relatedVenuesState}>
      {children}
    </RelatedVenuesContext.Provider>
  );
};

export const RelatedVenuesProvider: React.FC = ({ children }) => {
  const { worldId, spaceId } = useWorldAndSpaceByParams();
  const defaultState: RelatedVenuesContextState = useMemo(
    () => ({
      isLoading: false,
      worldSpaces: ALWAYS_EMPTY_ARRAY,
      relatedVenueIds: ALWAYS_EMPTY_ARRAY,
      findVenueInRelatedVenues: () => undefined,
    }),
    []
  );

  if (!worldId) {
    return (
      <RelatedVenuesContext.Provider value={defaultState}>
        {children}
      </RelatedVenuesContext.Provider>
    );
  }

  if (!spaceId) {
    return (
      <WorldSpacesProvider worldId={worldId}>{children}</WorldSpacesProvider>
    );
  }

  return (
    <LegacyRelatedVenuesProvider spaceId={spaceId} worldId={worldId}>
      {children}
    </LegacyRelatedVenuesProvider>
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
  currentVenueId?: SpaceId;
}

export interface RelatedVenuesData extends RelatedVenuesContextState {
  parentVenue?: SpaceWithId;
  currentVenue?: SpaceWithId;
  parentVenueId?: SpaceId;
}

export function useRelatedVenues(props: RelatedVenuesProps): RelatedVenuesData;
export function useRelatedVenues(): RelatedVenuesContextState;

// eslint-disable-next-line func-style, prefer-arrow/prefer-arrow-functions
export function useRelatedVenues(props?: RelatedVenuesProps) {
  const { currentVenueId } = props ?? {};
  const relatedVenuesState = useRelatedVenuesContext();

  const { findVenueInRelatedVenues } = relatedVenuesState;

  const currentVenue: SpaceWithId | undefined = useMemo(() => {
    return findVenueInRelatedVenues({ spaceId: currentVenueId });
  }, [currentVenueId, findVenueInRelatedVenues]);

  const parentVenue: SpaceWithId | undefined = useMemo(() => {
    if (!currentVenue) return;

    return findVenueInRelatedVenues({ spaceId: currentVenue.parentId });
  }, [currentVenue, findVenueInRelatedVenues]);

  const parentVenueId = parentVenue?.id;

  if (!props) {
    return relatedVenuesState;
  }

  return { ...relatedVenuesState, currentVenue, parentVenue, parentVenueId };
}
