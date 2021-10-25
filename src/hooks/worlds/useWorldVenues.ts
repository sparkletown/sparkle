import { useFirestore, useFirestoreCollectionData } from "reactfire";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { AnyVenue } from "types/venues";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

export interface UseWorldVenuesResult {
  worldVenues: WithId<AnyVenue>[];
  worldVenuesIds: string[];
  worldParentVenues: WithId<AnyVenue>[];
}

export const useWorldVenues = (worldId: string): UseWorldVenuesResult => {
  const firestore = useFirestore();
  const worldVenuesRef = firestore
    .collection("venues")
    .where("worldId", "==", worldId)
    .withConverter(withIdConverter());

  const { data: worldVenues } = useFirestoreCollectionData<WithId<AnyVenue>>(
    worldVenuesRef,
    {
      initialData: ALWAYS_EMPTY_ARRAY,
    }
  );

  const worldVenuesIds = worldVenues.map((venue) => venue.id);
  const worldParentVenues = worldVenues.filter((venue) => venue.parentId);

  return { worldVenues, worldVenuesIds, worldParentVenues };
};
