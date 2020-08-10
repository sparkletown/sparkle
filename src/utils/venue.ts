import { VenueTemplate } from "types/VenueTemplate";
import { Venue } from "types/Venue";

export const canHaveSubvenues = (venue: Venue): boolean =>
  [VenueTemplate.themecamp, VenueTemplate.partymap].includes(venue.template);
