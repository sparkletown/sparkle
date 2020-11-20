import { Venue } from "./Venue";
import { VenueTemplate } from "./VenueTemplate";
import { CampRoomData } from "./CampRoomData";
import { AnyVenue } from "./Firestore";
import { PartyMapVenue } from "./PartyMapVenue";
import { HAS_ROOMS_TEMPLATES } from "settings";

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
  activity?: any;
  showChat?: any;
  joinButtonText?: string;
  start_utc_seconds?: number;
}

export const isCampVenue = (val: AnyVenue): val is CampVenue =>
  val.template === VenueTemplate.themecamp;

export const isVenueWithRooms = (
  val: AnyVenue
): val is CampVenue | PartyMapVenue =>
  HAS_ROOMS_TEMPLATES.includes(val.template);
