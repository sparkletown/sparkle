import { useAsync } from "react-use";

import { fetchAllVenueEvents } from "api/events";

import { ReactHook } from "types/utility";
import { VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";
import { tracePromise } from "utils/performance";

const emptyArray: never[] = [];

export interface VenueEventsProps {
  venueIds: string[];
}

export interface VenueEventsData {
  isEventsLoading: boolean;
  isError: boolean;

  events: WithVenueId<WithId<VenueEvent>>[];
  eventsError?: Error;
}

export const useVenueEvents: ReactHook<VenueEventsProps, VenueEventsData> = ({
  venueIds,
}) => {
  const {
    loading: isEventsLoading,
    error: eventsError,
    value: events = emptyArray,
  } = useAsync(async () => {
    if (!venueIds) return emptyArray;

    return tracePromise(
      "useVenueEvents::fetchAllVenueEvents",
      () => fetchAllVenueEvents(venueIds),
      {
        metrics: {
          venueIdsLength: venueIds.length,
        },
      }
    );
  }, [venueIds]); // TODO: figure out this deps in an efficient way so it doesn't keep re-rendering

  return {
    isEventsLoading,
    isError: eventsError !== undefined,

    events,
  };
};
