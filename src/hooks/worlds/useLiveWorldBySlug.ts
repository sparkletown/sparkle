import { collection, getFirestore, query, where } from "firebase/firestore";

import {
  COLLECTION_WORLDS,
  DEFERRED,
  FIELD_HIDDEN,
  FIELD_SLUG,
} from "settings";

import { World } from "api/world";

import { WorldId, WorldSlug, WorldWithId } from "types/id";

import { withIdConverter } from "utils/converters";

import { useLiveQuery } from "hooks/fire/useLiveQuery";

export const useLiveWorldBySlug = (worldSlug: WorldSlug) => {
  const {
    data: worlds,
    isLoaded: isWorldLoaded,
    isLoading: isWorldLoading,
  } = useLiveQuery<WorldWithId>(
    worldSlug
      ? query(
          collection(getFirestore(), COLLECTION_WORLDS),
          where(FIELD_HIDDEN, "==", false),
          where(FIELD_SLUG, "==", worldSlug)
        ).withConverter(withIdConverter<World, WorldId>())
      : DEFERRED
  );

  return {
    world: worlds?.[0],
    isWorldLoaded,
    isWorldLoading,
  };
};
