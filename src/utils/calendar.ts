import calendarGenerator, { ICalCalendar } from "ical-generator";

import { VenueEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";
import { WithVenueId } from "utils/id";
import { getFullVenueInsideUrl } from "utils/url";

export interface CreateCalendarProps {
  events: WithVenueId<VenueEvent>[];
}

export const createCalendar = ({
  events,
}: CreateCalendarProps): ICalCalendar => {
  const calendar = calendarGenerator();

  events.forEach((event) =>
    calendar.createEvent({
      start: eventStartTime(event),
      end: eventEndTime(event),
      organizer: `${event.host || 'Unknown'} <undefined>`, // string format: "name <email>". email cannot be blank
      description: event.description,
      summary: event.name,
      url: getFullVenueInsideUrl(event.venueId),
    })
  );

  return calendar;
};

export interface DownloadCalendarProps {
  calendar: ICalCalendar;
  calendarName: string;
}

export const downloadCalendar = ({
  calendar,
  calendarName,
}: DownloadCalendarProps): void => {
  const outputFileName = `${calendarName}.ics`;

  const link = document.createElement("a");
  link.download = outputFileName;
  link.href = calendar.toURL();
  link.click();
};
