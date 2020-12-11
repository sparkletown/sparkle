import { AttendanceActions } from "./Attendance";
import { ChatActions } from "./Chat";
import { LocationActions } from "./Location";
import { RoomActions } from "./Room";

export type RootActions =
  | AttendanceActions
  | ChatActions
  | LocationActions
  | RoomActions;
