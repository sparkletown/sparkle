import { RoomData_v2 } from "types/RoomData";

export interface EditRoomProps {
  isVisible: boolean;
  onClickOutsideHandler: () => void;
  room: RoomData_v2;
  submitHandler: (values: RoomData_v2, index: number) => void;
  deleteHandler: () => void;
}
