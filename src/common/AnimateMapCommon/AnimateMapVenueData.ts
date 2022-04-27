import { Room } from "types/rooms";

export interface AnimateMapVenueData extends Room {
  id: number;
  isLive: boolean;
  countUsers: number;
  withoutPlate?: boolean;
}
