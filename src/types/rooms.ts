import Video from "twilio-video";

import { DisplayUser } from "types/User";

import { WithId } from "utils/id";

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
  image_url?: string;
  enterSound?: SoundConfigReference;
  template?: VenueRoomTemplate;
  roomIndex?: number;
}

export enum RoomTemplate {
  external = "external",
}

export type ParticipantWithUser = {
  participant: Video.Participant;
  user: WithId<DisplayUser>;
};

export type VenueRoomTemplate = VenueTemplate | RoomTemplate;
