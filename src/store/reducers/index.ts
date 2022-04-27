import { animateMapReducer } from "common/AnimateMapStore/reducers";

import { spaceCreateItemReducer } from "store/reducers/SpaceEdit";
import { worldEditStartValuesReducer } from "store/reducers/WorldEdit";

import { VenueTemplate } from "types/VenueTemplate";

import { attendanceReducer } from "./Attendance";
import { chatReducer } from "./Chat";
import { locationReducer } from "./Location";
import { roomReducer } from "./Room";
import { userProfileReducer } from "./UserProfile";

// Reducers per VenueTemplate (eg. reducer for playa template)
export const VenueTemplateReducers = {
  [VenueTemplate.animatemap]: animateMapReducer,
};

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
