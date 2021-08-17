import { FirebaseReducer } from "react-redux-firebase";

import { CustomInputsType } from "settings";

import { RoomData_v2 } from "types/rooms";
import { VenueTemplate } from "types/venues";

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
