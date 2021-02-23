import { RoomData_v2 } from "types/rooms";

export interface RoomEditModalProps {
  isVisible: boolean;
  onClickOutsideHandler: () => void;
  room: RoomData_v2;
  submitHandler: (values: RoomData_v2, index: number) => void;
  deleteHandler: () => void;
}
