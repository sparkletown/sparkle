import { useMemo } from "react";
import Bugsnag from "@bugsnag/js";
import { where } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  DEFERRED,
  FIELD_SLUG,
  FIELD_WORLD_ID,
  PATH,
} from "settings";

import {
  MaybeSpacesSlugLocation,
  MaybeWorldIdLocation,
  SpaceId,
  SpaceWithId,
} from "types/id";

import { useLiveCollection } from "hooks/fire/useLiveCollection";

export const useSpacesBySlug = ({
  spaceSlug,
  worldId,
}: MaybeSpacesSlugLocation & MaybeWorldIdLocation) => {
  const constraints = useMemo(
    () =>
      worldId
        ? [
            spaceSlug ? where(FIELD_SLUG, "==", spaceSlug) : DEFERRED,
            where(FIELD_WORLD_ID, "==", worldId),
          ]
        : [spaceSlug ? where(FIELD_SLUG, "==", spaceSlug) : DEFERRED],
    [spaceSlug, worldId]
  );

  const {
    data: spaces = ALWAYS_EMPTY_ARRAY,
    isLoading,
    isLoaded,
    error,
  } = useLiveCollection<SpaceWithId>({
    path: PATH.spaces,
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
