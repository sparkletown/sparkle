import { useAsync } from "react-use";

import { fetchAllSpaceEvents } from "api/events";

import { ReactHook } from "types/utility";
import { WorldExperience } from "types/venues";

import { WithId, WithVenueId } from "utils/id";
import { tracePromise } from "utils/performance";

const emptyArray: never[] = [];

export interface VenueEventsProps {
  worldId?: string;
  spaceIds: string[];
  // A dummy number that is used to trigger a refetch
  refetchIndex?: number;
}

export interface VenueEventsData {
  isEventsLoading: boolean;
  isError: boolean;

  events: WithVenueId<WithId<WorldExperience>>[];
  eventsError?: Error;
}

export const useSpaceEvents: ReactHook<VenueEventsProps, VenueEventsData> = ({
  worldId,
  spaceIds,
  refetchIndex = 0,
}) => {
  const {
    loading: isEventsLoading,
    error: eventsError,
    value: events = emptyArray,
  } = useAsync(async () => {
    if (!spaceIds || !worldId) return emptyArray;

    return tracePromise(
      "useVenueEvents::fetchAllVenueEvents",
      () => fetchAllSpaceEvents(worldId, spaceIds),
      {
        metrics: {
          venueIdsLength: spaceIds.length,
          refetchIndex,
        },
      }
    );
    // @debt This refetchIndex is a hack to force a refetch when we think the
    // underlying data might have changed. This is because the data structure
    // makes it hard to subscribe to all events on all venues.
  }, [refetchIndex, worldId, spaceIds]); // TODO: figure out this deps in an efficient way so it doesn't keep re-rendering

  return {
    // @debt related to the above
    // To make things seem smoother the loading flag is only set if the
    // refetchIndex is zero.
    isEventsLoading: isEventsLoading && refetchIndex === 0,
    isError: eventsError !== undefined,

    events,
  };
};
