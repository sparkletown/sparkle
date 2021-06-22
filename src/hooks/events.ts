import { useAsync } from "react-use";

//import { fetchAllVenueEvents } from "api/events";

import { ReactHook } from "types/utility";
import { VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";

//import { tracePromise } from "utils/performance";
import { useFirebase } from "react-redux-firebase";

import { SCHEDULE_LOAD_FROM_GS } from "settings";

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
  const firebase = useFirebase();

  const {
    loading: isEventsLoading,
    error: eventsError,
    value: events = emptyArray,
  } = useAsync(async () => {
    //load from gs
    const storage = firebase.storage();
    const url = await storage
      .ref()
      .child(SCHEDULE_LOAD_FROM_GS)
      .getDownloadURL();
    return fetch(url).then((res) => res.json());

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
  });
  return {
    isEventsLoading,
    isError: eventsError !== undefined,

    events,
  };
};
