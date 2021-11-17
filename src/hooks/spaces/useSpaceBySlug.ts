import { useFirestore, useFirestoreCollectionData } from "reactfire";
import Bugsnag from "@bugsnag/js";

import { AnyVenue } from "types/venues";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

export type UseSpaceBySlugResult = {
  space?: WithId<AnyVenue>;
  isLoaded: boolean;
  error?: string;
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

  if (!spaces?.[0] && isSpaceLoaded) {
    return {
      space: undefined,
      isLoaded: true,
      error: `Space with the following slug: ${spaceSlug} does not exist.`,
    };
  }

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

  return {
    space: spaces?.[0],
    isLoaded: isSpaceLoaded,
  };
};
