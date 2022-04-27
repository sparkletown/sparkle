import React, { createContext, useContext, useMemo } from "react";
import { where } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  ALWAYS_EMPTY_OBJECT,
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
  worldSpacesById: Record<SpaceId, SpaceWithId>;
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

  const worldSpacesById = useMemo(
    () => Object.fromEntries(worldSpaces.map((space) => [space.id, space])),
    [worldSpaces]
  );

  const relatedVenuesState: RelatedVenuesContextState = useMemo(
    () => ({
      isLoading,

      sovereignVenue,

      worldSpaces,
      worldSpacesById,
    }),
    [isLoading, worldSpaces, worldSpacesById, sovereignVenue]
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
  const worldSpacesById = useMemo(
    () => Object.fromEntries(worldSpaces.map((space) => [space.id, space])),
    [worldSpaces]
  );

  const relatedSpacesState: RelatedVenuesContextState = useMemo(
    () => ({
      isLoading,
      worldSpaces,
      worldSpacesById,
    }),
    [isLoading, worldSpaces, worldSpacesById]
  );

  return (
    <RelatedVenuesContext.Provider value={relatedSpacesState}>
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
      worldSpacesById: ALWAYS_EMPTY_OBJECT,
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

  const { worldSpacesById } = relatedVenuesState;

  const currentVenue: SpaceWithId | undefined = useMemo(() => {
    return currentVenueId && worldSpacesById[currentVenueId];
  }, [currentVenueId, worldSpacesById]);

  const parentVenue: SpaceWithId | undefined = useMemo(() => {
    return (
      currentVenue &&
      currentVenue.parentId &&
      worldSpacesById[currentVenue.parentId]
    );
  }, [currentVenue, worldSpacesById]);

  const parentVenueId = parentVenue?.id;

  if (!props) {
    return relatedVenuesState;
  }

  return { ...relatedVenuesState, currentVenue, parentVenue, parentVenueId };
}
