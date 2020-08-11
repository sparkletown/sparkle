import { Venue } from "./Venue";
import { VenueTemplate } from "./VenueTemplate";
// import { RoomData } from "./RoomData";
// import { EventData } from "./EventData";

export const isPartyMapVenue = (venue: Venue): venue is PartyMapVenue =>
  venue.template === VenueTemplate.partymap;

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
  // These fields belong to an Event
  // start_utc_seconds: number;
  // duration_hours: number;
  // party_name: string;

  entrance_hosted_hours: number;
  unhosted_entry_video_url: string;
  map_url: string;
  map_viewbox: string;
  password: string;
  admin_password?: string;
  owners: string[];
  // rooms: RoomData[];
  // subvenues replaces rooms
  // Should this be a subcollection?
  // sub_venues: {
  //   id: string;
  //   on_map: boolean;
  //   attendance_x?: string;
  //   attendance_y?: string;
  // }[];
}

// will be a subcollection of PartyMapVenue, same as current Events
export interface PartyMapEvent {
  name: string;
  start_utc_seconds: number;
  description: string;
  descriptions?: string[];
  duration_minutes: number;
  // Should this be a subcollection?
  // sub_venues: {
  //   id: string;
  //   schedule: PartyMapScheduleItem[];
  // };
}

// this is roughlt EventData
export interface PartyMapScheduleItem {
  start_minute: number;
  duration_minutes: number;
  host: string;
  name: string;
  text: string;
  interactivity: string;
}
