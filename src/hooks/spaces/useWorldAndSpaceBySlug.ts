import { useFirestore, useFirestoreCollectionData } from "reactfire";
import Bugsnag from "@bugsnag/js";

import { World } from "api/world";

import { AnyVenue, SpaceSlug } from "types/venues";
import { WorldSlug } from "types/world";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

export type UseSpaceBySlugResult = {
  world?: WithId<World>;
  space?: WithId<AnyVenue>;
  spaceId?: string;
  isLoaded: boolean;
  error?: string;
};

/**
 * Hook which will return the space when the slug is provided.
 * The intention is to be used on the client side, when the space slug is provided in the url.
 * @param spaceSlug
 * @returns
 */
export const useWorldAndSpaceBySlug = (
  worldSlug?: WorldSlug,
  spaceSlug?: SpaceSlug
): UseSpaceBySlugResult => {
  const firestore = useFirestore();

  const spacesRef = firestore
    .collection("venues")
    .where("slug", "==", spaceSlug ?? "")
    .withConverter(withIdConverter<AnyVenue>());

  // Note: Avoid using the option 'initialData' because it will make status always return 'success'
  const { data: spaces, status: spaceStatus } = useFirestoreCollectionData<
    WithId<AnyVenue>
  >(spacesRef);

  const worldsRef = firestore
    .collection("worlds")
    .where("slug", "==", worldSlug ?? "")
    .withConverter(withIdConverter<World>());
  const { data: worlds, status: worldStatus } = useFirestoreCollectionData<
    WithId<World>
  >(worldsRef);

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
      space: undefined,
      spaceId: undefined,
      isLoaded: false,
    };
  }

  if (!world) {
    return {
      world: undefined,
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
      space: undefined,
      spaceId: undefined,
      isLoaded: true,
      error: `Space with the following slug: ${spaceSlug} does not exist.`,
    };
  }

  return {
    world,
    space,
    spaceId: space?.id,
    isLoaded: true,
  };
};
