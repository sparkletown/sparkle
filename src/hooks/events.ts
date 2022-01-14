import { where } from "firebase/firestore";

import { COLLECTION_WORLD_EVENTS } from "settings";

import { WorldEvent } from "types/venues";

import { convertToFirestoreKey } from "utils/id";

import { useRefiCollection } from "hooks/reactfire/useRefiCollection";

export interface VenueEventsProps {
  worldId?: string;
  spaceIds: string[];
}

export interface VenueEventsData {
  isLoaded: boolean;
  events: WorldEvent[];
}

export const useSpaceEvents = ({
  worldId,
  spaceIds,
}: VenueEventsProps): VenueEventsData => {
  const { data: events, status } = useRefiCollection<WorldEvent>({
    path: [COLLECTION_WORLD_EVENTS],
    constraints: [where("worldId", "==", convertToFirestoreKey(worldId))],
  });

  if (!spaceIds || !worldId) {
    return {
      isLoaded: true,
      events: [],
    };
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
