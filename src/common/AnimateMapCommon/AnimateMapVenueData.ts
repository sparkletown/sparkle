import { AnimateMapRoom } from "./AnimateMapRoom";

export interface AnimateMapVenueData extends AnimateMapRoom {
  id: number;
  isLive: boolean;
  countUsers: number;
  withoutPlate?: boolean;
}
