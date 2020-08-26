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
