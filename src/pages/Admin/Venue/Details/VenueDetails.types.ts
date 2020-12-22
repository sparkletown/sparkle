import { Venue_v2 } from "types/Venue";

export interface VenueDetailsProps {
  venue: Venue_v2;
  onSave: () => void;
}
