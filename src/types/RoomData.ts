import { RoomEventData } from "./RoomEventData";

export interface BaseRoomData {
  about: string;
  subtitle: string;
  title: string;
  url: string;
}

export interface RoomData extends BaseRoomData {
  attendance_x?: string;
  attendance_y?: string;
  button_text?: string;
  events: RoomEventData;
  external_url: string;
  image: string;
  name?: string;
  on_list: boolean;
  on_map: boolean;
  path: string;
  template?: string;
}

// @debt should this extend from RoomData?
export interface PartyMapRoomData extends BaseRoomData {
  attendanceBoost?: number;
  height_percent: number;
  image_url: string;
  isEnabled: boolean;
  width_percent: number;
  x_percent: number;
  y_percent: number;
}
