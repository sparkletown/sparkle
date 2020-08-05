import { Venue } from "./Venue";
import { VenueTemplate } from "./VenueTemplate";
import { RoomData } from "./RoomData";

export const isPartyMapVenue = (val: Venue): val is PartyMapVenue =>
  "template" in val && val.template === VenueTemplate.partymap;

export interface PartyMapVenue extends Venue {
  template: VenueTemplate.partymap;
  host: {
    url: string;
    icon: string;
    name: string;
  };
  description: {
    text: string;
    program_url?: string;
  };
  start_utc_seconds: number;
  duration_hours: number;
  entrance_hosted_hours: number;
  party_name: string;
  unhosted_entry_video_url: string;
  map_url: string;
  map_viewbox: string;
  password: string;
  admin_password?: string;
  owners: string[];
  rooms: RoomData[];
}
