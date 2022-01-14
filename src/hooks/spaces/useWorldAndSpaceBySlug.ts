import { useFirestore, useFirestoreCollectionData } from "reactfire";
import Bugsnag from "@bugsnag/js";
import { collection, query, where } from "firebase/firestore";

import { COLLECTION_SPACES, COLLECTION_WORLDS } from "settings";

import { World } from "api/world";

import { SpaceId, WorldId } from "types/id";
import { AnyVenue, SpaceSlug } from "types/venues";
import { WorldSlug } from "types/world";

import { withIdConverter } from "utils/converters";
import { convertToFirestoreKey, WithId } from "utils/id";

export type UseSpaceBySlugResult = {
  world?: WithId<World>;
  worldId?: WorldId;
  space?: WithId<AnyVenue>;
  spaceId?: SpaceId;
  isLoaded: boolean;
  error?: string;
};

/**
 * Hook which will return the space when the slug is provided.
 * The intention is to be used on the client side, when the space slug is provided in the url.
 * @param worldSlug
 * @param spaceSlug
 * @returns
 */
export const useWorldAndSpaceBySlug = (
  worldSlug?: WorldSlug,
  spaceSlug?: SpaceSlug
): UseSpaceBySlugResult => {
  const firestore = useFirestore();

  // Note: Avoid using the option 'initialData' because it will make status always return 'success'

  const { data: spaces, status: spaceStatus } = useFirestoreCollectionData<
    WithId<AnyVenue>
  >(
    query(
      collection(firestore, COLLECTION_SPACES),
      where("slug", "==", convertToFirestoreKey(spaceSlug))
    ).withConverter(withIdConverter<AnyVenue>())
  );

  const { data: worlds, status: worldStatus } = useFirestoreCollectionData<
    WithId<World>
  >(
    query(
      collection(firestore, COLLECTION_WORLDS),
      where("isHidden", "==", false),
      // @debt we don't properly deal with the slug being undefined. This query
      // shouldn't happen if we don't have a world slug. This whole hook needs
      // a bit of a rethink. It's used incorrectly by the NavBar.
      where("slug", "==", convertToFirestoreKey(worldSlug))
    ).withConverter(withIdConverter<World>())
  );

  const isSpaceLoaded = spaceStatus !== "loading";
  const isWorldLoaded = worldStatus !== "loading";

  if (worlds?.length > 1) {
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

  const world = worlds?.[0];
  if (!isWorldLoaded || !isSpaceLoaded) {
    return {
      world: undefined,
      worldId: undefined,
      space: undefined,
      spaceId: undefined,
      isLoaded: false,
    };
  }

  if (!world) {
    return {
      world: undefined,
      worldId: undefined,
      space: undefined,
      spaceId: undefined,
      isLoaded: true,
      error: `World with the following slug: ${worldSlug} does not exist.`,
    };
  }

  const matchingSpaces = spaces.filter(
    (candidateSpace) => candidateSpace.worldId === world.id
  );

  if (matchingSpaces?.length > 1) {
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
      world: undefined,
      worldId: undefined,
      space: undefined,
      spaceId: undefined,
      isLoaded: true,
      error: `Space with the following slug: ${spaceSlug} does not exist.`,
    };
  }

  return {
    world,
    space,
    worldId: world?.id as WorldId | undefined,
    spaceId: space?.id as SpaceId | undefined,
    isLoaded: true,
  };
};
