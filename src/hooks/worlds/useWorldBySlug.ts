import { useMemo } from "react";
import Bugsnag from "@bugsnag/js";
import { where } from "firebase/firestore";

import {
  ALWAYS_EMPTY_ARRAY,
  DEFERRED,
  FIELD_HIDDEN,
  FIELD_SLUG,
  PATH,
} from "settings";

import {
  MaybeWorldSlugLocation,
  WorldId,
  WorldSlug,
  WorldWithId,
} from "types/id";

import { useLiveCollection } from "hooks/fire/useLiveCollection";

export const useWorldBySlug = ({ worldSlug: slug }: MaybeWorldSlugLocation) => {
  const {
    data: worlds = ALWAYS_EMPTY_ARRAY,
    isLoaded,
    isLoading,
    error,
  } = useLiveCollection<WorldWithId>({
    path: PATH.worlds,
    constraints: [
      slug ? where(FIELD_SLUG, "==", slug) : DEFERRED,
      where(FIELD_HIDDEN, "==", false),
    ],
  });

  if (worlds?.length > 1) {
    Bugsnag.notify(
      `Multiple worlds have been found with the following slug: ${slug}.`,
      (event) => {
        event.severity = "warning";
        event.addMetadata("hooks/worlds::useWorldBySlug", {
          slug,
          worlds,
        });
      }
    );
  }

  const world = worlds?.[0] as WorldWithId | undefined;
  const worldSlug = world?.slug as WorldSlug | undefined;
  const worldId = world?.id as WorldId | undefined;

  return useMemo(
    () => ({
      world,
      worldId,
      worldSlug,
      isLoading,
      isLoaded,
      error,
    }),
    [world, worldSlug, worldId, isLoaded, isLoading, error]
  );
};
