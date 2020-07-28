import { combineReducers } from "redux";

import {
  PREVIEW_ROOM,
  EXIT_PREVIEW_ROOM,
  TOGGLE_MUTE_REACTIONS,
} from "../actions";

function room(state = null, action) {
  switch (action.type) {
    case PREVIEW_ROOM:
      return action.room;
    case EXIT_PREVIEW_ROOM:
      return null;
    default:
      return state;
  }
}

function muteReactions(state = false, action) {
  switch (action.type) {
    case TOGGLE_MUTE_REACTIONS:
      return !state;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  room,
  muteReactions,
});

export default rootReducer;
