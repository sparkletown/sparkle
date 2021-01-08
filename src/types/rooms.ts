export type AnyRoom = Room | PartyMapRoom | AvatarGridRoom;

export interface BaseRoom {
  about: string;
  subtitle: string;
  title: string;
  url: string;
}

export interface Room extends BaseRoom {
  attendance_x?: string;
  attendance_y?: string;
  button_text?: string;
  events: RoomEvent[];
  external_url: string;
  image: string;
  name?: string;
  on_list: boolean;
  on_map: boolean;
  path: string;
  template?: string;
}

// TODO: most of our usage across the codebase uses PartyMapRoom, not Room.
//  We should refactor usages of Room, then rename this to Room. I don't believe
//  there is any valid reason why we need both types to exist.
// @debt should this extend from/be merged with Rooms?
export interface PartyMapRoom extends BaseRoom {
  attendanceBoost?: number;
  height_percent: number;
  image_url: string;
  isEnabled: boolean;
  width_percent: number;
  x_percent: number;
  y_percent: number;
}

export type RoomEvent = {
  start_minute: number;
  duration_minutes: number;
  host: string;
  name: string;
  text: string;
  interactivity: string;
};

export interface AvatarGridRoom {
  row: number;
  column: number;
  width: number;
  height: number;
  title: string;
  description: string;
  url: string;
  image_url?: string;
  isFull: boolean;
}
