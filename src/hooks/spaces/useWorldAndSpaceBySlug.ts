import { useCallback, useEffect, useState } from "react";
import { useFirestore } from "reactfire";
import firebase from 'firebase/app';

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

type UnifiedHandlerParams = {
  worldSnap?: firebase.firestore.QuerySnapshot<WithId<World>>;
  spaceSnap?: firebase.firestore.QuerySnapshot<WithId<AnyVenue>>;
}

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
  const [worldAndSpace, setWorldAndSpace] = useState<UseSpaceBySlugResult>({
    isLoaded: false,
  });

  const unifiedHandler = useCallback(({ worldSnap, spaceSnap }: UnifiedHandlerParams ) => {
    // TODO Error handling.
    setWorldAndSpace((prevState) => {
      const newState = {...prevState};
      if (spaceSnap) {
        newState.space = spaceSnap.docs[0].data();
      }
      if (worldSnap) {
        newState.world = worldSnap.docs[0].data();
      }
      if (newState.space && newState.world) {
        newState.isLoaded = true;
      }
      return newState;
  });
  }, [setWorldAndSpace]);

  useEffect(() => {
    const unsubscribeMethods: any[] = [];
    (async () => {
      if (!worldSlug || !spaceSlug) {
        setWorldAndSpace({
          world: undefined,
          space: undefined,
          spaceId: undefined,
          isLoaded: true,
          error: undefined,
        })
        return;
      }
      const worldsRef = firestore
        .collection("worlds")
        .where("isHidden", "==", false)
        // @debt we don't properly deal with the slug being undefined. This query
        // shouldn't happen if we don't have a world slug. This whole hook needs
        // a bit of a rethink. It's used incorrectly by (at least) the NavBar.
        .where("slug", "==", worldSlug || "")
        .withConverter(withIdConverter<World>());
      const worldsSnapshot = await worldsRef.get();
      // TODO error handling
      const world = worldsSnapshot.docs[0].data();

      const spacesRef = firestore
        .collection("venues")
        .where("slug", "==", spaceSlug ?? "")
        .where("worldId", "==", world.id)
        .withConverter(withIdConverter<AnyVenue>());
      const spacesSnapshot = await spacesRef.get();
      // TODO error handling
      console.log("reading space");
      const space = spacesSnapshot.docs[0]?.data();

      const unsubscribeWorlds = worldsRef.onSnapshot((snap) => {
        unifiedHandler({ worldSnap: snap, spaceSnap: undefined });
      })
      const unsubscribeSpaces = spacesRef.onSnapshot((snap) => {
        unifiedHandler({ worldSnap: undefined, spaceSnap: snap });
      })
      unsubscribeMethods.unshift(unsubscribeSpaces);
      unsubscribeMethods.unshift(unsubscribeWorlds);
    })();

    return () => {
      while (unsubscribeMethods.length) {
        const method = unsubscribeMethods.pop();
        method();
      }
    }
  }, [spaceSlug, worldSlug, setWorldAndSpace, firestore, unifiedHandler]);

  return worldAndSpace;

  /*
    const worldsRef = firestore
      .collection("worlds")
      .where("isHidden", "==", false)
      // @debt we don't properly deal with the slug being undefined. This query
      // shouldn't happen if we don't have a world slug. This whole hook needs
      // a bit of a rethink. It's used incorrectly by the NavBar.
      .where("slug", "==", worldSlug || "")
      .withConverter(withIdConverter<World>());
    const { data: worlds, status: worldStatus } = useFirestoreCollectionData<
      WithId<World>
    >(worldsRef);


  });
  console.log("result", result);

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
    .where("isHidden", "==", false)
    // @debt we don't properly deal with the slug being undefined. This query
    // shouldn't happen if we don't have a world slug. This whole hook needs
    // a bit of a rethink. It's used incorrectly by the NavBar.
    .where("slug", "==", worldSlug || "")
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
  };*/
};
