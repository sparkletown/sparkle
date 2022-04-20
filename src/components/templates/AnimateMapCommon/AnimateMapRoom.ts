import { SpaceId } from "./AnimateMapIds";
import { SoundConfigReference } from "./AnimateMapSounds";
import { VenueTemplate } from "./AnimateMapVenueTemplate";

export enum RoomType {
  unclickable = "UNCLICKABLE",
  mapFrame = "MAPFRAME",
  modalFrame = "MODALFRAME",
}

export enum RoomVisibility {
  hover = "hover",
  count = "count",
  nameCount = "count/name",
  none = "none",
  unclickable = "unclickable",
}

export type PortalTemplate = VenueTemplate | "external";

export type AnimateMapRoom = {
  width_percent: number;
  height_percent: number;
  x_percent: number;
  y_percent: number;
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
  spaceId?: SpaceId;
};
