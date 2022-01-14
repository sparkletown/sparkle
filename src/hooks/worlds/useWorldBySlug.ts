import { useFirestore, useFirestoreCollectionData } from "reactfire";
import Bugsnag from "@bugsnag/js";
import { collection, query, where } from "firebase/firestore";

import { COLLECTION_WORLDS } from "settings";

import { World } from "api/world";

import { withIdConverter } from "utils/converters";
import { convertToFirestoreKey, WithId } from "utils/id";

type UseWorldBySlugResult = {
  isLoaded: boolean;
  world?: WithId<World>;
  worldId: string | undefined;
  worldSlug: string | undefined;
};

/**
 * Hook which will return the world when the slug is provided.
 * The intention is to be used on the client side, when the world slug is provided in the url.
 * @param worldSlug
 * @returns
 */
export const useWorldBySlug: (worldSlug?: string) => UseWorldBySlugResult = (
  worldSlug
) => {
  const firestore = useFirestore();

  const worldsRef = query(
    collection(firestore, COLLECTION_WORLDS),
    where("slug", "==", convertToFirestoreKey(worldSlug)),
    where("isHidden", "==", false)
  ).withConverter<WithId<World>>(withIdConverter());

  const { data: worlds, status } = useFirestoreCollectionData<WithId<World>>(
    worldsRef,
    {
      initialData: undefined,
    }
  );

  if (worlds?.length > 1) {
    Bugsnag.notify(
      `Multiple worlds have been found with the following slug: ${worldSlug}.`,
      (event) => {
        event.severity = "warning";
        event.addMetadata("hooks/worlds::useWorldBySlug", {
          worldSlug,
          worlds,
        });
      }
    );
  }

  const world = worlds?.[0];
  const isLoaded = status !== "loading";

  return {
    isLoaded,
    world,
    worldId: world?.id,
    worldSlug: world?.slug,
  };
};
