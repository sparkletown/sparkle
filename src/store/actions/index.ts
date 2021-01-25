import { AttendanceActions } from "./Attendance";
import { ChatActions } from "./Chat";
import { LocationActions } from "./Location";
import { RoomActions } from "./Room";
import { SovereignVenueIdActions } from "./SovereignVenueId";

export type RootActions =
  | AttendanceActions
  | ChatActions
  | LocationActions
  | RoomActions
  | SovereignVenueIdActions;
