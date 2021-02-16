import { AttendanceActions } from "./Attendance";
import { ChatActions } from "./Chat";
import { LocationActions } from "./Location";
import { RoomActions } from "./Room";
import { SovereignVenueActions } from "./SovereignVenue";

export type RootActions =
  | AttendanceActions
  | ChatActions
  | LocationActions
  | RoomActions
  | SovereignVenueActions;
