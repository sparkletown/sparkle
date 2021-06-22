import React, { createContext, useContext, useMemo } from "react";
import { useAsync } from "react-use";

import { fetchAllVenueEvents } from "api/events";

import { ReactHook } from "types/utility";
import { VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";
import { tracePromise } from "utils/performance";
import { isTruthy } from "utils/types";

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

export const useVenueEvents: ReactHook<
  VenueEventsProps,
  VenueEventsData
> = () => {
  const eventsState = useEventsContext();

  return {
    events: eventsState.events,
    isError: eventsState.isError,
    isEventsLoading: eventsState.isLoading,

    eventsError: eventsState.error,
  };
};

export interface EventsContextState {
  events: WithVenueId<WithId<VenueEvent>>[];
  isLoading: boolean;
  isError: boolean;
  error?: Error;
}

const EventsContext = createContext<EventsContextState | undefined>(undefined);

export const EventsProvider: React.FC = ({ children }) => {
  const {
    loading: isVenueEventsLoading,
    error: venueEventsError,
    value: events = emptyArray,
  } = useAsync(
    async () =>
      tracePromise("EventsProvider::fetchAllVenueEvents", fetchAllVenueEvents),
    []
  );

  // console.log({ events });

  const eventsState: EventsContextState = useMemo(
    () => ({
      isLoading: isVenueEventsLoading,
      isError: isTruthy(venueEventsError),
      error: venueEventsError,

      events,
    }),
    [isVenueEventsLoading, venueEventsError, events]
  );

  return (
    <EventsContext.Provider value={eventsState}>
      {children}
    </EventsContext.Provider>
  );
};

export const useEventsContext = (): EventsContextState => {
  const eventsState = useContext(EventsContext);

  if (!eventsState) {
    throw new Error(
      "<EventsProvider/> not found. Did you forget to include it in your component hierarchy?"
    );
  }

  return eventsState;
};
