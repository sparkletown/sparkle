import { RoomActions } from "./Room";
import { LocationActions } from "./Location";
import { AttendanceActions } from "./Attendance";

export type RootActions = RoomActions | LocationActions | AttendanceActions;
