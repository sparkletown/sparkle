import {
  differenceInMinutes,
  endOfDay,
  getUnixTime,
  max,
  min,
  startOfDay,
} from "date-fns";

import { PersonalizedVenueEvent, VenueEvent } from "types/venues";
import { MyPersonalizedSchedule } from "types/User";

import { WithVenueId } from "utils/id";
import { eventEndTime, eventStartTime } from "utils/event";
import { isTruthy } from "utils/types";

export const prepareForSchedule = (
  day: Date,
  usersEvents: MyPersonalizedSchedule
) => (event: WithVenueId<VenueEvent>): PersonalizedVenueEvent => {
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
  `${event.venueId}#${event.room ?? ""}`;

export const extractLocation = (locationStr: string) =>
  locationStr.split("#", 2);

export function createCalendar(allPersonalEvents: PersonalizedVenueEvent[]) {
  let url = ["BEGIN:VCALENDAR", "VERSION:2.0"];
  allPersonalEvents.map((event) => {
    const calEvent = createEvent(event);
    return url.push(calEvent.join("\n"));
  });
  url.push("END:VCALENDAR");
  return url.join("\n");
}

const createEvent = (event: PersonalizedVenueEvent) => {
  // need to revise this for parsing events
  let calEvent = [
    "BEGIN:VEVENT",
    "DTSTART:" + formatDate(eventStartTime(event)),
    "DTEND:" + formatDate(eventEndTime(event)), // something wrong with this function
    "SUMMARY:" + event.name, // need to be replaced with actual info
    "UID:" + event.id,
    "DESCRIPTION:" + event.description, // need to be replaced with actual info
    "LOCATION:" + event?.room, // need to add https:// for ohbm sparkle programatically. settings.
    "BEGIN:VALARM",
    "TRIGGER:-PT15M",
    "REPEAT:1",
    "DURATION:PT15M",
    "ACTION:DISPLAY",
    "DESCRIPTION:Reminder",
    "END:VALARM",
    "END:VEVENT",
  ];
  return calEvent;
};

function formatDate(utctime: string | number | Date) {
  let dateTime = new Date(utctime);
  return [
    dateTime.getUTCFullYear(),
    pad(dateTime.getUTCMonth() + 1),
    pad(dateTime.getUTCDate()),
    "T",
    pad(dateTime.getUTCHours()),
    pad(dateTime.getUTCMinutes()) + "00Z",
  ].join("");
}

function pad(num: string | number) {
  return num < 10 ? "0" + num : num;
}
