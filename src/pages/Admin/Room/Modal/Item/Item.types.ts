import { FirebaseReducer } from "react-redux-firebase";
import { CustomInputsType } from "settings";
import { RoomData_v2 } from "types/RoomData";
import { VenueTemplate } from "types/VenueTemplate";

export interface RoomModalItemProps {
  name?: string;
  icon?: string;
  description?: string;
  venueId: string;
  user: FirebaseReducer.AuthState;
  onSubmitHandler: () => void;
  template: VenueTemplate;
  editValues?: RoomData_v2;
  customInputs?: CustomInputsType[];
}
