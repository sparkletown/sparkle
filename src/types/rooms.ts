import { SoundConfigReference } from "./sounds";
import { VenueTemplate } from "./venues";

export enum RoomType {
  unclickable = "UNCLICKABLE",
  mapFrame = "MAPFRAME",
  modalFrame = "MODALFRAME",
}

// @debt We should end up with 1 canonical room type
export interface Room {
  type?: RoomType;
  zIndex?: number;
  title: string;
  subtitle?: string;
  url: string;
  about: string;
  x_percent: number;
  y_percent: number;
  width_percent: number;
  height_percent: number;
  isEnabled: boolean;
  isLabelHidden?: boolean;
  image_url: string;
  enterSound?: SoundConfigReference;
  template?: VenueRoomTemplate;
}

// @debt We should end up with 1 canonical room type
export interface RoomData_v2 {
  type?: RoomType;
  zIndex?: number;
  title?: string;
  subtitle?: string;
  url?: string;
  description?: string;
  x_percent?: number;
  y_percent?: number;
  width_percent?: number;
  height_percent?: number;
  isEnabled?: boolean;
  isLabelHidden?: boolean;
  image_url?: string;
  enterSound?: SoundConfigReference;
  template?: VenueRoomTemplate;
  roomIndex?: number;
}

export enum RoomTemplate {
  external = "external",
}

export type VenueRoomTemplate = VenueTemplate | RoomTemplate;

export enum LABEL_OPTIONS {
  COUNT = "count/name",
  NONE = "none",
}

export const SHOW_LABEL_OPTIONS: { label: string; value: string }[] = [
  { label: "Count and names", value: LABEL_OPTIONS.COUNT },
  { label: "No label", value: LABEL_OPTIONS.NONE },
];
