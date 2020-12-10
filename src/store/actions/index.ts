import { RoomActions } from "./Room";
import { LocationActions } from "./Location";
import { AttendanceActions } from "./Attendance";
import { ChatActions } from "./Chat";

export type RootActions =
  | RoomActions
  | LocationActions
  | AttendanceActions
  | ChatActions;
