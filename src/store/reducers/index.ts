import { spaceCreateItemReducer } from "store/reducers/SpaceEdit";
import { worldEditStartValuesReducer } from "store/reducers/WorldEdit";

import { attendanceReducer } from "./Attendance";
import { chatReducer } from "./Chat";
import { locationReducer } from "./Location";
import { roomReducer } from "./Room";
import { userProfileReducer } from "./UserProfile";

// Other reducers (room entry/exit, mute reactions, etc.)
export const MiscReducers = {
  attendance: attendanceReducer,
  chat: chatReducer,
  location: locationReducer,
  room: roomReducer,
  userProfile: userProfileReducer,
  worldEditStartValues: worldEditStartValuesReducer,
  spaceCreateItem: spaceCreateItemReducer,
};
