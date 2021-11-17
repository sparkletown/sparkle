import { useMemo } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import Bugsnag from "@bugsnag/js";

import { AnyVenue } from "types/venues";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

type UseSpaceBySlugResult = {
  space?: WithId<AnyVenue>;
  isLoaded: boolean;
};

/**
 * Hook which will return the space when the slug is provided.
 * The intention is to be used on the client side, when the space slug is provided in the url.
 * @param spaceSlug
 * @returns
 */
export const useSpaceBySlug: (spaceSlug?: string) => UseSpaceBySlugResult = (
  spaceSlug
) => {
  const firestore = useFirestore();

  const spacesRef = firestore
    .collection("venues")
    .where("slug", "==", spaceSlug ?? "")
    .withConverter(withIdConverter<AnyVenue>());

  const { data: spaces, status } = useFirestoreCollectionData<WithId<AnyVenue>>(
    spacesRef,
    {
      initialData: undefined,
    }
  );

  const isSpaceLoaded = status !== "loading";

  if (spaces?.length > 1) {
    Bugsnag.notify(
      `Multiple spaces have been found with the following slug: ${spaceSlug}.`,
      (event) => {
        event.severity = "warning";
        event.addMetadata("hooks::useSpaceBySlug", {
          spaceSlug,
          spaces,
        });
      }
    );
  }

  return useMemo(
    () => ({
      space: spaces?.[0],
      isLoaded: isSpaceLoaded,
    }),
    [isSpaceLoaded, spaces]
  );
};
