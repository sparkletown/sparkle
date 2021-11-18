import { useFirestore, useFirestoreCollectionData } from "reactfire";
import Bugsnag from "@bugsnag/js";

import { AnyVenue } from "types/venues";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

export type UseSpaceBySlugResult = {
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
export const useSpaceBySlug = (spaceSlug?: string): UseSpaceBySlugResult => {
  const firestore = useFirestore();

  const spacesRef = firestore
    .collection("venues")
    .where("slug", "==", spaceSlug ?? "")
    .withConverter(withIdConverter<AnyVenue>());

  // Note: Avoid using the option 'initialData' because it will make status always return 'success'
  const { data: spaces, status } = useFirestoreCollectionData<WithId<AnyVenue>>(
    spacesRef
  );

  const isSpaceLoaded = status !== "loading";

  const space = spaces?.[0];

  if (!space && isSpaceLoaded) {
    return {
      space: undefined,
      spaceId: undefined,
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
    space: space,
    spaceId: space?.id,
    isLoaded: isSpaceLoaded,
  };
};
