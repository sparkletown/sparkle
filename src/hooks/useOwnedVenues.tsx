import { useMemo } from "react";
import { useFirestore } from "reactfire";
import { collection, query, where } from "firebase/firestore";

import { COLLECTION_SPACES } from "settings";

import { ReactHook } from "types/utility";
import { AnyVenue } from "types/venues";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

import { useUser } from "hooks/useUser";

import { useMaybeFirestoreCollectionData } from "./useMaybe";

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
  const relatedVenuesRef =
    worldId && userId
      ? query(
          collection(firestore, COLLECTION_SPACES),
          where("worldId", "==", worldId ?? ""),
          where("owners", "array-contains", userId ?? "")
        ).withConverter(withIdConverter<AnyVenue>())
      : undefined;

  const { data: venues, status } =
    useMaybeFirestoreCollectionData<WithId<AnyVenue>>(relatedVenuesRef);
  return useMemo(
    () => ({
      isLoading: status === "loading",
      ownedVenues: venues ?? [],
      currentVenue: (venues || []).find((venue) => venue.id === currentVenueId),
    }),
    [venues, currentVenueId, status]
  );
};
