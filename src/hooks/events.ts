import { useAsync } from "react-use";

import { ReactHook } from "types/utility";
import { VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";

//import { tracePromise } from "utils/performance";
//import { fetchAllVenueEvents } from "api/events";

import { useSelector } from "hooks/useSelector";

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
  const cache = useSelector((state) => state.cache);

  const {
    loading: isEventsLoading,
    error: eventsError,
    value: events = emptyArray,
  } = useAsync(async () => {
    if (!venueIds) return emptyArray;

    //load from cache(gs)
    return cache.events.then((events) => {
      return events.filter((e) => venueIds.includes(e.venueId));
    });

    //load from firebase - depends on venueIds
    /*
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
    */
  }, [cache, venueIds]);
  return {
    isEventsLoading,
    isError: eventsError !== undefined,

    events,
  };
};
