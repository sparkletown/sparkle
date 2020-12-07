import { FirebaseReducer } from "react-redux-firebase";
import { CustomInputsType } from "settings";
import { RoomData_v2 } from "types/CampRoomData";

export interface RoomModalItemProps {
  name?: string;
  icon?: string;
  description?: string;
  venueId: string;
  user: FirebaseReducer.AuthState;
  onSubmitHandler: () => void;
  template?: string;
  editValues?: RoomData_v2;
  customInputs?: CustomInputsType[];
}
