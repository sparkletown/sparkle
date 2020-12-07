import { RoomData_v2 } from "types/CampRoomData";

export interface MapPreviewProps {
  venueName: string;
  mapBackground?: string;
  rooms?: RoomData_v2[];
  venueId: string;
}
