import { RoomData_v2 } from "types/rooms";

export interface RoomModalProps {
  isVisible: boolean;
  templates?: string[];
  venueId: string;
  onSubmitHandler: () => void;
  onClickOutsideHandler: () => void;
  editingRoom?: RoomData_v2 | null;
}
