export type EventData = {
  start_minute: number;
  duration_minutes: number;
  host: string;
  name: string;
  text: string;
  interactivity: string;
}[];

export interface PartyMapData {
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
  rooms: RoomData[];
}

export interface RoomData {
  name?: string;
  title: string;
  subtitle: string;
  about: string;
  image: string;
  on_list: boolean;
  template?: string;
  on_map: boolean;
  button_text?: string;
  attendance_x?: string;
  attendance_y?: string;
  url: string;
  path: string;
  events: EventData;
  external_url: string;
}
