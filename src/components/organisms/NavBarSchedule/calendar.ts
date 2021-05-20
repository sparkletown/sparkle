import { eventEndTime, eventStartTime } from "utils/event";
import { PersonalizedVenueEvent } from "types/venues";
import { VenueEvent } from "types/venues";
import { WithVenueId } from "utils/id";

import { ics } from "./ics";

export const createCalendar = (
  allEvents: PersonalizedVenueEvent[] | WithVenueId<VenueEvent>[],
  filename: string
) => {
  const cal = ics();
  if (!cal) return;
  allEvents.map((event: PersonalizedVenueEvent | WithVenueId<VenueEvent>) => {
    return cal.addEvent(
      event.id!,
      event.name,
      event.host || "",
      window.location.origin.toString() + "/in/" + event.venueId,
      formatDate(eventStartTime(event)),
      formatDate(eventEndTime(event)),
      ""
    );
  });
  cal.download(filename + "_calendar", ".ics");
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
