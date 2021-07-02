import { DEFAULT_AUDITORIUM_SECTION_CAPACITY } from "settings";

import { AuditoriumSection } from "types/auditorium";
import { AuditoriumVenue } from "types/venues";

export const getSectionCapacity = (
  venue: AuditoriumVenue,
  section: AuditoriumSection
) =>
  section.capacity ??
  venue.sectionCapacity ??
  DEFAULT_AUDITORIUM_SECTION_CAPACITY;
