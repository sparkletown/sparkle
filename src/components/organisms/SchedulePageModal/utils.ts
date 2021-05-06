import {
  addDays,
  compareAsc,
  differenceInMinutes,
  endOfDay,
  format,
  isWithinInterval,
  startOfDay,
} from "date-fns";

import { Room } from "types/rooms";
import { PersonalizedVenueEvent, VenueEvent } from "types/venues";
import { MyPersonalizedSchedule } from "types/User";

import { WithVenueId } from "utils/id";
import { ONE_MINUTE_IN_SECONDS, ONE_SECOND_IN_MILLISECONDS } from "utils/time";
import { isTruthy } from "utils/types";

import { RoomWithEvents } from "components/molecules/Schedule/Schedule.types";

export const isEventThisDay = (date: Date) => {
  return (event: VenueEvent) => {
    return isWithinInterval(date, {
      start: startOfDay(event.start_utc_seconds * ONE_SECOND_IN_MILLISECONDS),
      end: endOfDay(
        (event.start_utc_seconds +
          event.duration_minutes * ONE_MINUTE_IN_SECONDS) *
          ONE_SECOND_IN_MILLISECONDS
      ),
    });
  };
};

export const adjustEventTiming = (date: Date) => {
  return (event: WithVenueId<VenueEvent>) => {
    const dates = [
      event.start_utc_seconds * ONE_SECOND_IN_MILLISECONDS,
      (event.start_utc_seconds +
        event.duration_minutes * ONE_MINUTE_IN_SECONDS) *
        ONE_SECOND_IN_MILLISECONDS,
      startOfDay(date),
      endOfDay(date),
    ].sort(compareAsc);

    const startUtcMilliseconds =
      dates[1] instanceof Date ? dates[1].getTime() : dates[1];

    return {
      ...event,
      start_utc_seconds: startUtcMilliseconds / ONE_SECOND_IN_MILLISECONDS,
      duration_minutes: differenceInMinutes(dates[2], dates[1]),
    };
  };
};

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

export const bookmarkPersonalizedEvents = (
  usersEvents: MyPersonalizedSchedule
) => (event: WithVenueId<VenueEvent>): WithVenueId<PersonalizedVenueEvent> => ({
  ...event,
  isSaved: isTruthy(event.id && usersEvents[event.venueId]?.includes(event.id)),
});

export const scheduleDayBuilder = (
  today: Date,
  events: WithVenueId<VenueEvent>[],
  rooms: Room[],
  usersEvents: MyPersonalizedSchedule
) => (dayIndex: number) => {
  const day = addDays(today, dayIndex);

  const daysEvents: WithVenueId<PersonalizedVenueEvent>[] = events
    .filter(isEventThisDay(day))
    .map(adjustEventTiming(day))
    .map(bookmarkPersonalizedEvents(usersEvents));

  const roomsWithEvents = extendRoomsWithDaysEvents(rooms, daysEvents);

  return {
    isToday: dayIndex === 0,
    weekday: format(day, "E"),
    dayStartUtcSeconds: Math.floor(day.getTime() / ONE_SECOND_IN_MILLISECONDS),
    rooms: roomsWithEvents.filter((room) => room.events.length > 0),
    personalEvents: daysEvents.filter((event) => event.isSaved),
  };
};
