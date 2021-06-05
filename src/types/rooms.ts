import { SoundConfigReference } from "./sounds";

import { VenueEvent } from "types/venues";
import { WithVenueId } from "utils/id";
export enum RoomTypes {
  unclickable = "UNCLICKABLE",
}

// @debt We should end up with 1 canonical room type
export interface Room {
  events?: Array<WithVenueId<VenueEvent>>;
  type?: RoomTypes;
  zIndex?: number;
  title: string;
  subtitle: string;
  url: string;
  about: string;
  x_percent: number;
  y_percent: number;
  width_percent: number;
  height_percent: number;
  isEnabled: boolean;
  image_url: string;
  enterSound?: SoundConfigReference;
  // Legacy?
  attendanceBoost?: number;
}

// @debt We should end up with 1 canonical room type
export interface RoomData_v2 {
  type?: RoomTypes;
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
  image_url?: string;
  enterSound?: SoundConfigReference;
  template?: string;
  roomIndex?: number;
}
