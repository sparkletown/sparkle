import { Reducer } from "redux";

import { roomReducer } from "./Room";
import { locationReducer } from "./Location";
import { attendanceReducer } from "./Attendance";
import { sovereignVenueIdReducer } from "./SovereignVenueId";

// Reducers per VenueTemplate (eg. reducer for playa template)
export const VenueTemplateReducers: { [key: string]: Reducer } = {};

// Other reducers (room entry/exit, mute reactions, etc.)
export const MiscReducers = {
  room: roomReducer,
  location: locationReducer,
  attendance: attendanceReducer,
  sovereignVenueId: sovereignVenueIdReducer,
};
