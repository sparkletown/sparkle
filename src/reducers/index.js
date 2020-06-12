import { combineReducers } from "redux";
import { firestoreReducer } from "redux-firestore";

import { PREVIEW_ROOM, EXIT_PREVIEW_ROOM, SET_USER } from "../actions";

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

// TODO: find a better name
function user(state = null, action) {
  switch (action.type) {
    case SET_USER:
      return action.user;
    default:
      return state;
  }
}

// // TODO: load this from firebase on login
// function userProfile(state = null, action) {
//   switch (action.type) {
//     case SET_USER:
//       return action.user;
//     default:
//       return state;
//   }
// }

const rootReducer = combineReducers({
  firestore: firestoreReducer,
  room,
  user,
});

export default rootReducer;
