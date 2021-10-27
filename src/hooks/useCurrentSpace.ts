import { useMemo } from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";

import { ReactHook } from "types/utility";
import { AnyVenue as Space } from "types/venues";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

interface UseCurrentSpaceProps {
  spaceId?: string;
}

interface UseCurrentSpaceReturn {
  isLoaded: boolean;
  space?: WithId<Space>;
}

/**
 * Hook that returns the space when an id is provided.
 * @param param0 This is the id of the space that is fetched from the collection.
 * @returns Object with 'space' and 'isLoaded'
 */
export const useCurrentSpace: ReactHook<
  UseCurrentSpaceProps,
  UseCurrentSpaceReturn
> = ({ spaceId }) => {
  const firestore = useFirestore();
  const spaceRef = firestore
    .collection("venues")
    .doc(spaceId)
    .withConverter(withIdConverter<Space>());

  const { data: space, status } = useFirestoreDocData<WithId<Space>>(spaceRef);

  const isSpaceLoaded = status !== "loading";

  return useMemo(
    () => ({
      space: space,
      isLoaded: isSpaceLoaded,
    }),
    [isSpaceLoaded, space]
  );
};
