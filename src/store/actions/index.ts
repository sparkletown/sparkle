import { AttendanceActions } from "./Attendance";
import { ChatActions } from "./Chat";
import { LocationActions } from "./Location";
import { RoomActions } from "./Room";
import { UserProfileActions } from "./UserProfile";

export type RootActions =
  | AttendanceActions
  | ChatActions
  | LocationActions
  | RoomActions
  | UserProfileActions;
