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
import { VenueEvent } from "types/venues";

import { WithVenueId } from "utils/id";
import { ONE_MINUTE_IN_SECONDS, ONE_SECOND_IN_MILLISECONDS } from "utils/time";

import { RoomWithEvents } from "components/molecules/Schedule/Schedule";

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
  daysEvents: WithVenueId<VenueEvent>[]
): RoomWithEvents[] => {
  return rooms.map((room) => {
    const events = daysEvents.filter((event) => event?.room === room?.title);
    return { ...room, events };
  });
};

export const scheduleDayBuilder = (
  today: Date,
  events: WithVenueId<VenueEvent>[],
  rooms: Room[]
) => (dayIndex: number) => {
  const day = addDays(today, dayIndex);

  const daysEvents = events
    .filter(isEventThisDay(day))
    .map(adjustEventTiming(day));

  const roomsWithEvents = extendRoomsWithDaysEvents(rooms, daysEvents);

  return {
    isToday: dayIndex === 0,
    weekday: format(day, "E"),
    dayStartUtcSeconds: Math.floor(day.getTime() / ONE_SECOND_IN_MILLISECONDS),
    rooms: roomsWithEvents.filter((room) => room.events.length > 0),
  };
};
