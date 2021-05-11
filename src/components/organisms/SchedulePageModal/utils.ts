import {
  differenceInMinutes,
  endOfDay,
  getUnixTime,
  isWithinInterval,
  max,
  min,
  startOfDay,
} from "date-fns";

import { AnyVenue } from "types/venues";
import { PersonalizedVenueEvent, VenueEvent } from "types/venues";
import { MyPersonalizedSchedule } from "types/User";

import { WithVenueId, WithId } from "utils/id";
import { eventEndTime, eventStartTime } from "utils/event";
import { isTruthy } from "utils/types";

import { VenueWithEvents } from "components/molecules/Schedule/Schedule.types";

export const isEventLaterThisDay = (date: number | Date) => (
  event: VenueEvent
) =>
  isWithinInterval(date, {
    start: startOfDay(eventStartTime(event)),
    end: eventEndTime(event),
  });

export const extendVenuesWithDaysEvents = (
  venues: WithId<AnyVenue>[],
  daysEvents: WithVenueId<PersonalizedVenueEvent>[]
): VenueWithEvents[] => {
  //@ts-ignore
  return venues.map((venue) => {
    const events: WithVenueId<PersonalizedVenueEvent>[] = daysEvents.filter(
      (event) => event?.venueId === venue.id
    );
    return { ...venue, events };
  });
};

export const prepareForSchedule = (
  day: Date,
  usersEvents: MyPersonalizedSchedule
) => (event: WithVenueId<VenueEvent>): WithVenueId<PersonalizedVenueEvent> => {
  const startOfEventToShow = max([eventStartTime(event), startOfDay(day)]);
  const endOfEventToShow = min([eventEndTime(event), endOfDay(day)]);

  return {
    ...event,
    start_utc_seconds: getUnixTime(startOfEventToShow),
    duration_minutes: differenceInMinutes(endOfEventToShow, startOfEventToShow),
    isSaved: isTruthy(
      event.id && usersEvents[event.venueId]?.includes(event.id)
    ),
  };
};
