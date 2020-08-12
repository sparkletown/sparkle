import { Venue } from "./Venue";
import { VenueTemplate } from "./VenueTemplate";
import { VenueEvent } from "./VenueEvent";
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

  entrance_hosted_hours: number;
  unhosted_entry_video_url: string;
  map_url: string;
  map_viewbox: string;
  password: string;
  admin_password?: string;
  owners: string[];
}

export interface SubVenue {
  on_map: boolean;
  attendance_x?: string;
  attendance_y?: string;
}

export interface PartyMapEventSubVenue {
  id: string;
  schedule: PartyMapScheduleItem[];
}

export const isPartyMapEvent = (event?: VenueEvent): event is PartyMapEvent => {
  return event !== undefined && "sub_venues" in event;
};

export interface PartyMapEvent extends VenueEvent {
  sub_venues: PartyMapEventSubVenue[];
}

export interface PartyMapScheduleItem {
  start_minute: number;
  duration_minutes: number;
  host: string;
  name: string;
  text: string;
  interactivity: string;
}
