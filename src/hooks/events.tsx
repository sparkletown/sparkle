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

export const useVenueEvents: ReactHook<VenueEventsProps, VenueEventsData> = ({
  venueIds,
}) => {
  const { events, isError, isLoading, error } = useEventsContext();

  const requestedEvents = useMemo(
    () => events.filter((event) => venueIds.includes(event.venueId)),
    [events, venueIds]
  );

  return {
    events: requestedEvents,
    isError: isError,
    isEventsLoading: isLoading,

    eventsError: error,
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
