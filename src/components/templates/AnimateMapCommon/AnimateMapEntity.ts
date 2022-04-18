import { AnimateMapFirebarrelData } from "./AnimateMapFirebarrelData";
import { AnimateMapUserData } from "./AnimateMapUserData";
import { AnimateMapVenueData } from "./AnimateMapVenueData";

export interface AnimateMapEntity {
  x: number;
  y: number;
  data: AnimateMapUserData | AnimateMapVenueData | AnimateMapFirebarrelData;
}

export interface AnimateMapUser extends AnimateMapEntity {
  data: AnimateMapUserData;
}

export interface AnimateMapVenue extends AnimateMapEntity {
  data: AnimateMapVenueData;
}

export interface AnimateMapFirebarrel extends AnimateMapEntity {
  data: AnimateMapFirebarrelData;
}
