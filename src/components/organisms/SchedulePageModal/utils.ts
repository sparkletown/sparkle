import {
  differenceInMinutes,
  endOfDay,
  getUnixTime,
  isWithinInterval,
  max,
  min,
  startOfDay,
} from "date-fns";

import { Room, RoomWithEvents } from "types/rooms";
import { PersonalizedVenueEvent, VenueEvent } from "types/venues";
import { MyPersonalizedSchedule } from "types/User";

import { WithVenueId } from "utils/id";
import { eventEndTime, eventStartTime } from "utils/event";
import { isTruthy } from "utils/types";

export const isEventLaterThisDay = (date: number | Date) => (
  event: VenueEvent
) =>
  isWithinInterval(date, {
    start: startOfDay(eventStartTime(event)),
    end: eventEndTime(event),
  });

export const extendRoomsWithDaysEvents = (
  rooms: Room[],
  daysEvents: WithVenueId<PersonalizedVenueEvent>[]
): RoomWithEvents[] => {
  return rooms.map((room) => {
    const events: WithVenueId<PersonalizedVenueEvent>[] = daysEvents.filter(
      (event) => event?.room === room?.title
    );
    return { ...room, events };
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

export const buildLocationString = (event: WithVenueId<VenueEvent>) =>
  `${event.venueId}#${event.room}`;

export const extractLocation = (locationStr: string) =>
  locationStr.split("#", 2);
