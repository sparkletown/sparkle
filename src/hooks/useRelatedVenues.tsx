import React, { createContext, useContext, useMemo } from "react";
import { where } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  ALWAYS_EMPTY_OBJECT,
  COLLECTION_SPACES,
  FIELD_IS_HIDDEN,
  FIELD_WORLD_ID,
} from "settings";

import { SpaceId, SpaceWithId, WorldIdLocation } from "types/id";

import { isDefined } from "utils/types";

import { useRefiCollection } from "hooks/fire/useRefiCollection";
import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

interface RelatedVenuesContextState {
  isLoading: boolean;

  worldSpaces: SpaceWithId[];
  worldSpacesById: Record<SpaceId, SpaceWithId>;
}

const RelatedVenuesContext = createContext<
  RelatedVenuesContextState | undefined
>(undefined);

const WorldSpacesProvider: React.FC<WorldIdLocation> = ({
  worldId,
  children,
}) => {
  const { data, isLoading } = useRefiCollection<SpaceWithId>({
    path: [COLLECTION_SPACES],
    constraints: [
      where(FIELD_WORLD_ID, "==", worldId),
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
  const { worldId } = useWorldAndSpaceByParams();
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

  return (
    <WorldSpacesProvider worldId={worldId}>{children}</WorldSpacesProvider>
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

export const useRelatedVenues = (): RelatedVenuesContextState => {
  const relatedVenuesState = useRelatedVenuesContext();
  return { ...relatedVenuesState };
};
