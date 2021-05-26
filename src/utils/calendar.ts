import ical from "ical-generator";

import { VenueEvent } from "types/venues";

import { eventEndTime, eventStartTime } from "utils/event";

import { WithVenueId } from "utils/id";

import { getFullVenueInsideUrl } from "utils/url";

export interface CreateCalendarProps {
  calendarName: string;
  events: WithVenueId<VenueEvent>[];
}

const createCalendar = ({ calendarName, events }: CreateCalendarProps) => {
  const cal = ical({ name: calendarName });

  events.forEach((event) =>
    cal.createEvent({
      start: eventStartTime(event),
      end: eventEndTime(event),
      organizer: `${event.host} <undefined>`, // string format: "name <email>". email cannot be blank
      description: event.description,
      summary: event.name,
      url: getFullVenueInsideUrl(event.venueId),
    })
  );
  return cal;
};

export const downloadCalendar = ({
  calendarName,
  events,
}: CreateCalendarProps) => {
  const cal = createCalendar({ calendarName: calendarName, events: events });
  const outputCal = cal.toURL();
  const outputFile = `${calendarName}.ics`;
  const link = document.createElement("a");
  link.download = outputFile;
  link.href = outputCal;
  console.log(link.href);
  link.click();
};
