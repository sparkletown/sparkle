import { roomReducer } from "./Room";
import { locationReducer } from "./Location";
import { Reducer } from "redux";

// Reducers per VenueTemplate (eg. reducer for playa template)
export const VenueTemplateReducers: { [key: string]: Reducer } = {};

// Other reducers (room entry/exit, mute reactions, etc.)
export const MiscReducers = { room: roomReducer, location: locationReducer };
