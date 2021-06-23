import React, { createContext, useContext, useMemo } from "react";
import { useAsync } from "react-use";

import { fetchAllVenueEvents } from "api/events";

import { ReactHook } from "types/utility";
import { VenueEvent } from "types/venues";

import { WithId, WithVenueId } from "utils/id";
import { tracePromise } from "utils/performance";
import { isTruthy } from "utils/types";

import { useSovereignVenueId } from "./useSovereignVenueId";

const emptyArray: never[] = [];

export interface VenueEventsProps {
  venueIds: string[];
}

export interface VenueEventsData {
  isEventsLoading: boolean;
  isError: boolean;

  events: WithVenueId<WithId<VenueEvent>>[];
}

export const useVenueEvents: ReactHook<VenueEventsProps, VenueEventsData> = ({
  venueIds,
}) => {
  const { events, isError, isLoading } = useEventsContext();

  const requestedEvents = useMemo(
    () => events.filter((event) => venueIds.includes(event.venueId)),
    [events, venueIds]
  );

  return {
    events: requestedEvents,
    isError: isError,
    isEventsLoading: isLoading,
  };
};

export interface EventsContextState {
  events: WithVenueId<WithId<VenueEvent>>[];
  isLoading: boolean;
  isError: boolean;
  venueEventsError?: Error;
  sovereignVenueIdError?: string;
}

const EventsContext = createContext<EventsContextState | undefined>(undefined);

export interface EventsProviderProps {
  venueId?: string;
}

export const EventsProvider: React.FC<EventsProviderProps> = ({
  children,
  venueId,
}) => {
  const {
    sovereignVenueId,
    isSovereignVenueIdLoading,

    errorMsg: sovereignVenueIdError,
  } = useSovereignVenueId({
    venueId,
  });

  const {
    loading: isVenueEventsLoading,
    error: venueEventsError,
    value: events = emptyArray,
  } = useAsync(async () => {
    if (!sovereignVenueId) return;

    return tracePromise("EventsProvider::fetchAllVenueEvents", () =>
      fetchAllVenueEvents(sovereignVenueId)
    );
  }, [sovereignVenueId]);

  const eventsState: EventsContextState = useMemo(
    () => ({
      isLoading: isVenueEventsLoading || isSovereignVenueIdLoading,
      isError: isTruthy(venueEventsError || sovereignVenueIdError),
      venueEventsError,
      sovereignVenueIdError,

      events,
    }),
    [
      isVenueEventsLoading,
      venueEventsError,
      events,
      isSovereignVenueIdLoading,
      sovereignVenueIdError,
    ]
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
