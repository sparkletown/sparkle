import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";

import {
  PREVIEW_ROOM,
  EXIT_PREVIEW_ROOM,
  TIMER_STARTED,
  TIMER_STOPPED,
  TIMER_TICK,
  SET_USER,
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

function timer(state = { time: null }, action) {
  switch (action.type) {
    case TIMER_STARTED:
      return {
        interval: action.interval,
        time: state.time,
      };
    case TIMER_TICK:
      return {
        interval: state.interval,
        time: action.time,
      };
    case TIMER_STOPPED:
    default:
      return state;
  }
}

function user(state = null, action) {
  switch (action.type) {
    case SET_USER:
      return action.user;
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  firestore: firestoreReducer,
  room,
  timer,
  user,
});

export default rootReducer;
