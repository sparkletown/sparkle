import { useFirestore, useFirestoreCollectionData } from "reactfire";

import { COLLECTION_WORLD_EVENTS } from "settings";

import { WorldEvent } from "types/venues";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";

export interface VenueEventsProps {
  worldId?: string;
  spaceIds: string[];
}

export interface VenueEventsData {
  isLoaded: boolean;
  events: WithId<WorldEvent>[];
}

export const useSpaceEvents = ({
  worldId,
  spaceIds,
}: VenueEventsProps): VenueEventsData => {
  const firestore = useFirestore();

  const eventsRef = firestore
    .collection(COLLECTION_WORLD_EVENTS)
    .where("worldId", "==", worldId || "")
    .withConverter(withIdConverter<WorldEvent>());

  const { data: events, status, error } = useFirestoreCollectionData<
    WithId<WorldEvent>
  >(eventsRef);

  if (!spaceIds || !worldId) {
    return {
      isLoaded: true,
      events: [],
    };
  }

  if (error) {
    console.error(error);
  }

  // Filter in code as firebase only supports a maximum of 10 items in an array
  // query.
  const spaceEvents = (events || []).filter((event) =>
    spaceIds.includes(event.spaceId)
  );
  spaceEvents.sort((a, b) => a.startUtcSeconds - b.startUtcSeconds);

  return {
    isLoaded: status !== "loading",
    events: spaceEvents,
  };
};
