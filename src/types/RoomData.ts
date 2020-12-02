import { RoomEventData } from "./RoomEventData";

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
  events: RoomEventData;
  external_url: string;
}

export interface PartyMapRoomData {
  x_percent: number;
  y_percent: number;
  width_percent: number;
  height_percent: number;
  title: string;
  subtitle: string;
  about: string;
  image_url: string;
  url: string;
  isEnabled: boolean;
  attendanceBoost?: number;
}

// @debt should this extend from RoomData?
export interface CampRoomData {
  title: string;
  subtitle: string;
  about: string;
  image_url: string;
  x_percent: number;
  y_percent: number;
  width_percent: number;
  height_percent: number;
  url: string;
  isEnabled: boolean;
  attendanceBoost?: number;
}
