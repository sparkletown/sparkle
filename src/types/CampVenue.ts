import { Venue } from "./Venue";
import { VenueTemplate } from "./VenueTemplate";
import { CampRoomData } from "./CampRoomData";
import { AnyVenue } from "./Firestore";

export interface CampVenue extends Venue {
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
}

export const isCampVenue = (val: AnyVenue): val is CampVenue =>
  val.template === VenueTemplate.themecamp;
