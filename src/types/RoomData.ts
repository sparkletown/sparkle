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

export interface RoomData_v2 {
  title?: string;
  subtitle?: string;
  url?: string;
  description?: string;
  x_percent?: number;
  y_percent?: number;
  width_percent?: number;
  height_percent?: number;
  isEnabled?: boolean;
  template?: string;
  image_url?: string;
  roomIndex?: number;
}
