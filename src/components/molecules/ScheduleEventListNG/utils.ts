import { EVENT_STARTING_SOON_TIMEFRAME } from "settings";

import { PersonalizedVenueEvent } from "types/venues";

import { isEventLive, isEventStartingSoon } from "utils/event";

export const isEventLater = (event: PersonalizedVenueEvent) =>
  !(
    isEventLive(event) ||
    isEventStartingSoon(event, EVENT_STARTING_SOON_TIMEFRAME)
  );

export const isEventSoon = (event: PersonalizedVenueEvent) =>
  !isEventLive(event) &&
  isEventStartingSoon(event, EVENT_STARTING_SOON_TIMEFRAME);
