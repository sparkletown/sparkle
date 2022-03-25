import { useMemo } from "react";
import Bugsnag from "@bugsnag/js";
import { collection, getFirestore, query, where } from "firebase/firestore";

import {
  COLLECTION_SPACES,
  COLLECTION_WORLDS,
  DEFERRED,
  FIELD_HIDDEN,
  FIELD_SLUG,
} from "settings";

import { World } from "api/world";

import { LoadStatus } from "types/fire";
import {
  SpaceId,
  SpaceSlug,
  SpaceWithId,
  WorldId,
  WorldSlug,
  WorldWithId,
} from "types/id";
import { AnyVenue } from "types/venues";

import { withIdConverter } from "utils/converters";
import { SparkleHookError } from "utils/error";

import { useFireQuery } from "hooks/fire/useFireQuery";

type UseWorldAndSpaceBySlug = (options: {
  worldSlug?: WorldSlug;
  spaceSlug?: SpaceSlug;
}) => LoadStatus & {
  world?: WorldWithId;
  worldId?: WorldId;
  space?: SpaceWithId;
  spaceId?: SpaceId;
};

/**
 * Hook which will return the space when the slug is provided.
 * The intention is to be used on the client side, when the space slug is provided in the url.
 */
export const useWorldAndSpaceBySlug: UseWorldAndSpaceBySlug = ({
  worldSlug,
  spaceSlug,
}) => {
  const { data: spaces, isLoaded: isSpaceLoaded } = useFireQuery<SpaceWithId>(
    useMemo(
      () =>
        spaceSlug
          ? query(
              collection(getFirestore(), COLLECTION_SPACES),
              where(FIELD_SLUG, "==", spaceSlug)
            ).withConverter(withIdConverter<AnyVenue, SpaceId>())
          : DEFERRED,
      [spaceSlug]
    )
  );

  const { data: worlds, isLoaded: isWorldLoaded } = useFireQuery<WorldWithId>(
    useMemo(
      () =>
        worldSlug
          ? query(
              collection(getFirestore(), COLLECTION_WORLDS),
              where(FIELD_HIDDEN, "==", false),
              where(FIELD_SLUG, "==", worldSlug)
            ).withConverter(withIdConverter<World, WorldId>())
          : DEFERRED,
      [worldSlug]
    )
  );

  const world = worlds?.[0];
  const worldId = world?.id;
  const matchingSpaces = spaces?.filter((space) => space.worldId === worldId);
  const space = matchingSpaces?.[0];
  const spaceId = space?.id;

  if (worlds && worlds.length > 1) {
    Bugsnag.notify(
      `Multiple worlds have been found with the following slug: ${worldSlug}.`,
      (event) => {
        event.severity = "warning";
        event.addMetadata("hooks::useWorldAndSpaceBySlug", {
          worldSlug,
          worlds,
        });
      }
    );
  }

  if (matchingSpaces && matchingSpaces?.length > 1) {
    Bugsnag.notify(
      `Multiple spaces have been found with the following slug: ${spaceSlug}.`,
      (event) => {
        event.severity = "warning";
        event.addMetadata("hooks::useWorldAndSpaceBySlug", {
          worldSlug,
          spaceSlug,
          matchingSpaces,
        });
      }
    );
  }

  return useMemo(() => {
    const error = !world
      ? new SparkleHookError({
          message: `World with the following slug: ${worldSlug} does not exist.`,
        })
      : !space
      ? new SparkleHookError({
          message: `Space with the following slug: ${spaceSlug} does not exist.`,
        })
      : undefined;

    const isLoaded = isSpaceLoaded && isWorldLoaded;
    const isLoading = !isLoaded;

    return {
      space,
      spaceId,
      world,
      worldId,
      isLoaded,
      isLoading,
      error,
    };
  }, [
    world,
    space,
    worldId,
    spaceId,
    worldSlug,
    spaceSlug,
    isWorldLoaded,
    isSpaceLoaded,
  ]);
};
