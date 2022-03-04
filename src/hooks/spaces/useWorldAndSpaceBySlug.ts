import Bugsnag from "@bugsnag/js";
import { collection, getFirestore, query, where } from "firebase/firestore";

import { COLLECTION_SPACES, COLLECTION_WORLDS, DEFERRED } from "settings";

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
  const firestore = getFirestore();
  const { data: spaces, isLoaded: isSpaceLoaded } = useFireQuery<SpaceWithId>(
    spaceSlug
      ? query(
          collection(firestore, COLLECTION_SPACES),
          where("slug", "==", spaceSlug)
        ).withConverter(withIdConverter<AnyVenue, SpaceId>())
      : DEFERRED
  );

  const { data: worlds, isLoaded: isWorldLoaded } = useFireQuery<WorldWithId>(
    worldSlug
      ? query(
          collection(firestore, COLLECTION_WORLDS),
          where("isHidden", "==", false),
          where("slug", "==", worldSlug)
        ).withConverter(withIdConverter<World, WorldId>())
      : DEFERRED
  );

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

  if (!isWorldLoaded || !isSpaceLoaded) {
    return {
      world: undefined,
      worldId: undefined,
      space: undefined,
      spaceId: undefined,
      isLoaded: false,
      isLoading: true,
    };
  }

  const world = worlds?.[0];

  if (!world) {
    return {
      world: undefined,
      worldId: undefined,
      space: undefined,
      spaceId: undefined,
      isLoaded: true,
      isLoading: false,
      error: new SparkleHookError(
        `World with the following slug: ${worldSlug} does not exist.`
      ),
    };
  }

  const matchingSpaces = spaces?.filter(
    (candidateSpace) => candidateSpace.worldId === world.id
  );

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

  const space = matchingSpaces?.[0];

  if (!space) {
    return {
      world,
      worldId: world?.id,
      space: undefined,
      spaceId: undefined,
      isLoaded: true,
      isLoading: false,
      error: new SparkleHookError(
        `Space with the following slug: ${spaceSlug} does not exist.`
      ),
    };
  }

  return {
    world,
    space,
    worldId: world?.id,
    spaceId: space?.id,
    isLoaded: true,
    isLoading: false,
  };
};
