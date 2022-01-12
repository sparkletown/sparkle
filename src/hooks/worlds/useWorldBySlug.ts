import { useFirestore, useFirestoreCollectionData } from "reactfire";
import Bugsnag from "@bugsnag/js";
import { collection, query, where } from "firebase/firestore";
import { withFirebaseDataHook } from "hocs/withFirebaseDataHook";

import { COLLECTION_WORLDS } from "settings";

import { World } from "api/world";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

import { useWorldParams } from "./useWorldParams";

type UseWorldBySlugResult = {
  isLoaded: boolean;
  world?: WithId<World>;
  worldId: string | undefined;
  worldSlug: string | undefined;
};

const useQuery = (worldSlug?: string) => {
  const firestore = useFirestore();

  // @debt Ideally we would figure out how to make this function require a world
  // slug as errors can occur here in the query that are cryptic to debug.
  return query(
    collection(firestore, COLLECTION_WORLDS),
    where("slug", "==", worldSlug ?? ""),
    where("isHidden", "==", false)
  ).withConverter<WithId<World>>(withIdConverter());
};

export const useWorldBySlugListener = () => {
  const { worldSlug } = useWorldParams();
  const worldsRef = useQuery(worldSlug);
  return useFirestoreCollectionData<WithId<World>>(worldsRef);
};

/**
 * @deprecated
 * Hook which will return the world when the slug is provided.
 * The intention is to be used on the client side, when the world slug is provided in the url.
 * @param worldSlug
 * @returns
 */
export const useWorldBySlug: (worldSlug?: string) => UseWorldBySlugResult = (
  worldSlug
) => {
  const worldsRef = useQuery(worldSlug);

  const { data: worlds, status } =
    useFirestoreCollectionData<WithId<World>>(worldsRef);

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

export const withWorldFromSlug = withFirebaseDataHook(
  useWorldBySlugListener,
  (worlds) => ({ world: worlds?.[0] })
);
