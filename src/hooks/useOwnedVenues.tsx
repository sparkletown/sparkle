import { useMemo } from "react";
import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { collection, query, where } from "firebase/firestore";

import { COLLECTION_WORLDS } from "settings";

import { ReactHook } from "types/utility";
import { AnyVenue } from "types/venues";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

export interface UseOwnedVenuesProps {
  worldId?: string;
  currentVenueId?: string;
}

export interface UseOwnedVenuesData {
  isLoading: boolean;
  currentVenue?: WithId<AnyVenue>;
  ownedVenues: WithId<AnyVenue>[];
}

export const useOwnedVenues: ReactHook<
  UseOwnedVenuesProps,
  UseOwnedVenuesData
> = ({ worldId, currentVenueId }): UseOwnedVenuesData => {
  const { userId } = useUser();
  const firestore = useFirestore();
  const relatedVenuesRef = query(
    collection(firestore, COLLECTION_WORLDS),
    where("worldId", "==", worldId ?? ""),
    where("owners", "array-contains", userId ?? "")
  ).withConverter(withIdConverter<AnyVenue>());

  const { data: venues, status } = useFirestoreCollectionData<WithId<AnyVenue>>(
    relatedVenuesRef,
    {
      initialData: [],
    }
  );

  return useMemo(
    () => ({
      isLoading: status === "loading",
      ownedVenues: venues ?? [],
      currentVenue: (venues || []).find((venue) => venue.id === currentVenueId),
    }),
    [venues, currentVenueId, status]
  );
};
