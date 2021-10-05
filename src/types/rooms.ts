import Video from "twilio-video";

import { DisplayUser } from "types/User";

import { WithId } from "utils/id";

import { SoundConfigReference } from "./sounds";
import { RoomVisibility, VenueTemplate } from "./venues";

export enum RoomType {
  unclickable = "UNCLICKABLE",
  mapFrame = "MAPFRAME",
  modalFrame = "MODALFRAME",
}

export interface Room {
  type?: RoomType;
  zIndex?: number;
  title: string;
  subtitle?: string;
  url: string;
  about?: string;
  x_percent: number;
  y_percent: number;
  width_percent: number;
  height_percent: number;
  isEnabled: boolean;
  visibility?: RoomVisibility;
  image_url: string;
  enterSound?: SoundConfigReference;
  template?: VenueTemplate;
}

export type ParticipantWithUser<
  T extends Video.Participant = Video.Participant
> = {
  participant: T;
  user: WithId<DisplayUser>;
};
