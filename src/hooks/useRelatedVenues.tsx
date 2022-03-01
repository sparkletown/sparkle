import React, { createContext, useCallback, useContext, useMemo } from "react";
import { where } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  COLLECTION_SPACES,
  FIELD_WORLD_ID,
} from "settings";

import {
  SpaceId,
  SpaceSlug,
  SpaceWithId,
  WorldAndSpaceIdLocation,
  WorldId,
  WorldIdLocation,
} from "types/id";
import { AnyVenue } from "types/venues";

import { convertToFirestoreKey, WithId } from "utils/id";
import { isDefined } from "utils/types";
import { findSovereignVenue } from "utils/venue";

import { useRefiCollection } from "hooks/fire/useRefiCollection";

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

  findVenueInRelatedVenues: (
    searchOptions: FindVenueInRelatedVenuesOptions
  ) => WithId<AnyVenue> | undefined;
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
    constraints: [where(FIELD_WORLD_ID, "==", convertToFirestoreKey(worldId))],
  });

  const relatedVenues = data ?? ALWAYS_EMPTY_ARRAY;

  const sovereignVenueSearchResult = useMemo(() => {
    if (!spaceId || !Array.isArray(relatedVenues) || !relatedVenues.length) {
      return;
    }

    return findSovereignVenue(spaceId, relatedVenues);
  }, [spaceId, relatedVenues]);

  const sovereignVenue = sovereignVenueSearchResult?.sovereignVenue;
  const sovereignVenueDescendantIds =
    sovereignVenueSearchResult?.checkedVenueIds;
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
      isLoading,

      sovereignVenue,
      sovereignVenueId,
      sovereignVenueDescendantIds,

      relatedVenues,
      relatedVenueIds,

      descendantVenues,

      findVenueInRelatedVenues,
    }),
    [
      isLoading,
      relatedVenues,
      relatedVenueIds,
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

const WorldSpacesProvider: React.FC<WorldIdLocation> = ({
  worldId,
  children,
}) => {
  const { data, isLoading } = useRefiCollection<SpaceWithId>({
    path: [COLLECTION_SPACES],
    constraints: [where(FIELD_WORLD_ID, "==", convertToFirestoreKey(worldId))],
  });

  const relatedVenues = data?.filter(isDefined) ?? ALWAYS_EMPTY_ARRAY;

  // considering only worldId is provided, before this being defined maybe a whole world could be made to have a default space
  const sovereignVenueId = undefined;

  const relatedVenueIds = useMemo(() => relatedVenues.map(({ id }) => id), [
    relatedVenues,
  ]);

  const descendantVenues = useMemo(
    () => relatedVenues.filter(({ id }) => id !== sovereignVenueId),
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
      isLoading,
      relatedVenues,
      relatedVenueIds,
      descendantVenues,
      findVenueInRelatedVenues,
    }),
    [
      isLoading,
      relatedVenues,
      relatedVenueIds,
      descendantVenues,
      findVenueInRelatedVenues,
    ]
  );

  return (
    <RelatedVenuesContext.Provider value={relatedVenuesState}>
      {children}
    </RelatedVenuesContext.Provider>
  );
};

export const RelatedVenuesProvider: React.FC<{
  spaceId?: SpaceId;
  worldId?: WorldId;
}> = ({ worldId, spaceId, children }) => {
  const defaultState: RelatedVenuesContextState = useMemo(
    () => ({
      isLoading: false,
      relatedVenues: ALWAYS_EMPTY_ARRAY,
      relatedVenueIds: ALWAYS_EMPTY_ARRAY,
      descendantVenues: ALWAYS_EMPTY_ARRAY,
      findVenueInRelatedVenues: () => undefined,
    }),
    []
  );

  if (!worldId) {
    // @debt maybe even provide an error message to user and/or in console and/or to bugsnag
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

export interface RelatedVenuesData extends RelatedVenuesContextState {
  parentVenue?: SpaceWithId;
  currentVenue?: WithId<AnyVenue>;
  parentVenueId?: string;
}

type UseRelatedVenues =
  | ((options: { currentVenueId?: string }) => RelatedVenuesData)
  | (() => RelatedVenuesContextState);

/**
 * @deprecated Please use an alternative that doesn't depend on RelatedVenuesContext.Provider
 *
 * @see src/hooks/spaces/useRelatedSpaces.ts
 */
export const useRelatedVenues: UseRelatedVenues = (props) => {
  const { currentVenueId } = props ?? {};
  const relatedVenuesState = useRelatedVenuesContext();

  const { findVenueInRelatedVenues } = relatedVenuesState;

  const currentVenue: WithId<AnyVenue> | undefined = useMemo(() => {
    return findVenueInRelatedVenues({ spaceId: currentVenueId });
  }, [currentVenueId, findVenueInRelatedVenues]);

  const parentVenue: SpaceWithId | undefined = useMemo(() => {
    if (!currentVenue) return;

    const result = findVenueInRelatedVenues({ spaceId: currentVenue.parentId });
    return result as SpaceWithId;
  }, [currentVenue, findVenueInRelatedVenues]);

  const parentVenueId = parentVenue?.id;

  if (!props) {
    return relatedVenuesState;
  }

  return { ...relatedVenuesState, currentVenue, parentVenue, parentVenueId };
};
