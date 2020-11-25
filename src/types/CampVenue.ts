import { Venue } from "./Venue";
import { VenueTemplate } from "./VenueTemplate";
import { CampRoomData } from "./CampRoomData";
import { AnyVenue } from "./Firestore";
import { PartyMapVenue } from "./PartyMapVenue";
import { HAS_ROOMS_TEMPLATES } from "settings";

// @debt which of these params are exactly the same as on Venue? Can we simplify this?
export interface CampVenue extends Venue {
  id: string;
  template: VenueTemplate.themecamp;
  mapBackgroundImageUrl?: string;
  host: {
    url: string;
    icon: string;
    name: string;
  };
  description?: {
    text: string;
    program_url?: string;
  };
  name: string;
  map_url: string;
  owners: string[];
  rooms: CampRoomData[];
  activity?: string;
  showChat?: boolean;
  joinButtonText?: string;
  start_utc_seconds?: number;
}

export const isCampVenue = (val: AnyVenue): val is CampVenue =>
  val.template === VenueTemplate.themecamp;

export const isVenueWithRooms = (
  val: AnyVenue
): val is CampVenue | PartyMapVenue =>
  HAS_ROOMS_TEMPLATES.includes(val.template);
