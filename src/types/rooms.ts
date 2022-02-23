import { Participant } from "components/attendee/VideoComms/types";

import { RoomVisibility } from "types/RoomVisibility";
import { DisplayUser } from "types/User";

import { WithId } from "utils/id";

import { SoundConfigReference } from "./sounds";
import { PortalTemplate } from "./venues";

export enum RoomType {
  unclickable = "UNCLICKABLE",
  mapFrame = "MAPFRAME",
  modalFrame = "MODALFRAME",
}

export interface PortalBox {
  width_percent: number;
  height_percent: number;
  x_percent: number;
  y_percent: number;
}

export interface Room extends PortalBox {
  type?: RoomType;
  zIndex?: number;
  title: string;
  subtitle?: string;
  url: string;
  about?: string;
  isEnabled: boolean;
  visibility?: RoomVisibility;
  image_url: string;
  enterSound?: SoundConfigReference;
  template?: PortalTemplate;
  spaceId?: string;
}

export type ParticipantWithUser<T extends Participant = Participant> = {
  participant: T;
  user: WithId<DisplayUser>;
};

export type RoomInput = Omit<Room, "image_url"> & {
  image_url?: string;
  image_file?: FileList;
};

// @debt Since the additional 2 fields are optional, they can probably be moved to RoomInput
export type PortalInput = Room & {
  venueName?: string;
  useUrl?: boolean;
  image_url?: string;
  image_file?: FileList;
};
