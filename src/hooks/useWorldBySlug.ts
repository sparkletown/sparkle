import { useFirestore, useFirestoreCollectionData } from "reactfire";
import Bugsnag from "@bugsnag/js";

import { World } from "api/admin";

import { worldConverter } from "utils/converters";
import { WithId } from "utils/id";

type UseWorldEditResult = {
  world?: WithId<World>;
  isLoaded: boolean;
};

/**
 * Hook which will return the world when the slug is provided.
 * The intention is to be used on the client side, when the world slug is provided in the url.
 * @param worldSlug
 * @returns
 */
export const useWorldBySlug: (worldSlug?: string) => UseWorldEditResult = (
  worldSlug
) => {
  const firestore = useFirestore();

  const worldsRef = firestore
    .collection("worlds")
    .where("slug", "==", worldSlug ?? "")
    .withConverter(worldConverter);

  const { data: worlds, status } = useFirestoreCollectionData<WithId<World>>(
    worldsRef,
    {
      initialData: undefined,
    }
  );

  const isWorldLoaded = status !== "loading";

  if (!worlds?.[0]) {
    Bugsnag.notify(
      `World with the following slug: ${worldSlug} does not exist.`,
      (event) => {
        event.severity = "warning";
        event.addMetadata("hooks::useWorldBySlug", {
          worldSlug,
        });
      }
    );
  }

  if (worlds?.length > 1) {
    Bugsnag.notify(
      `Multiple worlds have been found with the following slug: ${worldSlug}.`,
      (event) => {
        event.severity = "warning";
        event.addMetadata("hooks::useWorldBySlug", {
          worldSlug,
          worlds: worlds,
        });
      }
    );
  }

  return {
    world: worlds?.[0],
    isLoaded: isWorldLoaded,
  };
};
