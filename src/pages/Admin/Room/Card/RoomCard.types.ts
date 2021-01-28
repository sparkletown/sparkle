import { RoomData_v2 } from "types/rooms";

export interface RoomCardProps {
  editHandler: () => void;
  onEventHandler: (title: string) => void;
  room: RoomData_v2;
  venueId: string;
  roomIndex: number;
}
