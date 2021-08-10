import { Reducer } from "redux";

import { attendanceReducer } from "./Attendance";
import { chatReducer } from "./Chat";
import { locationReducer } from "./Location";
import { roomReducer } from "./Room";
import { sovereignVenueReducer } from "./SovereignVenue";
import { userProfileReducer } from "./UserProfile";

// Reducers per VenueTemplate (eg. reducer for playa template)
export const VenueTemplateReducers: { [key: string]: Reducer } = {};

// Other reducers (room entry/exit, mute reactions, etc.)
export const MiscReducers = {
  attendance: attendanceReducer,
  chat: chatReducer,
  location: locationReducer,
  room: roomReducer,
  sovereignVenue: sovereignVenueReducer,
  userProfile: userProfileReducer,
};
