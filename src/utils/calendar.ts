import { PersonalizedVenueEvent } from "types/venues";
import { VenueEvent } from "types/venues";
import { eventEndTime, eventStartTime } from "utils/event";
import { WithVenueId } from "utils/id";
import { getFullVenueInsideUrl } from "utils/url";

import ical from "ical-generator";

export const createCalendar = (
  allEvents: PersonalizedVenueEvent[] | WithVenueId<VenueEvent>[],
  calendername: string
) => {
  const cal = ical({ name: calendername });

  if (!cal) return;

  allEvents.map((event: PersonalizedVenueEvent | WithVenueId<VenueEvent>) =>
    cal.createEvent({
      start: eventStartTime(event),
      end: eventEndTime(event),
      summary: event.name,
      location: getFullVenueInsideUrl(event.venueId),
    })
  );
  window.open(cal.toURL());
};
