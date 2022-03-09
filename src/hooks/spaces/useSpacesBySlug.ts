import { useMemo } from "react";
import Bugsnag from "@bugsnag/js";
import { where } from "firebase/firestore";

import { COLLECTION_SPACES, FIELD_SLUG, FIELD_WORLD_ID } from "settings";

import {
  MaybeWorldIdLocation,
  SpaceId,
  SpacesSlugLocation,
  SpaceWithId,
} from "types/id";

import { convertToFirestoreKey } from "utils/id";

import { useRefiCollection } from "hooks/fire/useRefiCollection";

export const useSpacesBySlug = ({
  spaceSlug,
  worldId,
}: SpacesSlugLocation & MaybeWorldIdLocation) => {
  const constraints = useMemo(() => {
    const queryConstraints = [
      where(FIELD_SLUG, "==", convertToFirestoreKey(spaceSlug)),
    ];
    if (worldId) {
      queryConstraints.push(where(FIELD_WORLD_ID, "==", worldId));
    }
    return queryConstraints;
  }, [spaceSlug, worldId]);

  const {
    data: spaces,
    isLoading,
    isLoaded,
    error,
  } = useRefiCollection<SpaceWithId>({
    path: [COLLECTION_SPACES],
    constraints,
  });

  // it is OK to have same slug as long as the worldId is different, it's a problem otherwise
  if (worldId && spaces?.length > 1) {
    Bugsnag.notify(
      `Multiple spaces have been found with the following slug: ${spaceSlug} for worldId: ${worldId}.`,
      (event) => {
        event.severity = "warning";
        event.addMetadata("hooks::useSpacesBySlug", {
          spaceSlug,
          worldId,
          spaces,
        });
      }
    );
  }

  // the first found, for convenience when worldId is provided
  const space = spaces?.[0];
  const spaceId = space?.id as SpaceId | undefined;

  return useMemo(
    () => ({
      spaces,
      space,
      spaceSlug,
      spaceId,
      worldId,
      isLoaded,
      isLoading,
      error,
    }),
    [spaceId, space, spaces, spaceSlug, worldId, isLoaded, isLoading, error]
  );
};
