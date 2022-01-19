import { useMemo } from "react";
import Bugsnag from "@bugsnag/js";
import { where } from "firebase/firestore";

import {
  COLLECTION_SPACES,
  COLLECTION_WORLDS,
  FIELD_HIDDEN,
  FIELD_SLUG,
} from "settings";

import {
  SpaceId,
  SpaceSlugLocation,
  SpaceWithId,
  WorldId,
  WorldWithId,
} from "types/id";

import { useFireCollection } from "hooks/reactfire/useFireCollection";

export const useWorldOrSpaceBySlug = ({
  spaceSlug,
  worldSlug,
}: SpaceSlugLocation) => {
  const worldConstraints = useMemo(
    () => [
      where(FIELD_HIDDEN, "==", false),
      where(FIELD_SLUG, "==", worldSlug),
    ],
    [worldSlug]
  );

  const spaceConstraints = useMemo(() => [where(FIELD_SLUG, "==", spaceSlug)], [
    spaceSlug,
  ]);

  const {
    data: spaces,
    isLoaded: isSpaceLoaded,
    isLoading: isSpaceLoading,
  } = useFireCollection<SpaceWithId>({
    path: [COLLECTION_SPACES],
    constraints: spaceConstraints,
  });

  const {
    data: worlds,
    isLoaded: isWorldLoaded,
    isLoading: isWorldLoading,
  } = useFireCollection<WorldWithId>({
    path: [COLLECTION_WORLDS],
    constraints: worldConstraints,
  });

  const world = worlds?.[0];
  const worldId: WorldId | undefined = world?.id;

  const matchingSpaces = spaces.filter((space) => space.worldId === worldId);
  const space = matchingSpaces?.[0];

  if (worlds?.length > 1) {
    Bugsnag.notify(
      `Multiple worlds have been found with the following slug: ${worldSlug}.`,
      (event) => {
        event.severity = "warning";
        event.addMetadata("hooks::useWorldOrSpaceBySlug", {
          worldSlug,
          worlds,
        });
      }
    );
  }

  if (matchingSpaces?.length > 1) {
    Bugsnag.notify(
      `Multiple spaces have been found with the following slug: ${spaceSlug}.`,
      (event) => {
        event.severity = "warning";
        event.addMetadata("hooks::useWorldOrSpaceBySlug", {
          worldSlug,
          spaceSlug,
          matchingSpaces,
        });
      }
    );
  }

  const error =
    !space && !world && isWorldLoaded && isSpaceLoaded
      ? `Neither world with worldSlug: ${worldSlug} nor space with spaceSlug: ${spaceSlug} exist`
      : undefined;

  return useMemo(
    () => ({
      world,
      space,
      worldId,
      spaceId: space?.id as SpaceId | undefined,
      isLoaded: isSpaceLoaded && isWorldLoaded,
      isLoading: isSpaceLoading || isWorldLoading,
      error,
    }),
    [
      world,
      space,
      worldId,
      isSpaceLoaded,
      isSpaceLoading,
      isWorldLoaded,
      isWorldLoading,
      error,
    ]
  );
};
