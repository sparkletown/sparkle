import { leaveRoom } from "utils/useLocationUpdateEffect";

export const PREVIEW_ROOM = "PREVIEW_ROOM";
export const EXIT_PREVIEW_ROOM = "EXIT_PREVIEW_ROOM";
export const SET_USER = "SET_USER";
export const TOGGLE_MUTE_REACTIONS = "TOGGLE_MUTE_REACTIONS";

export function previewRoom(room) {
  return { type: PREVIEW_ROOM, room };
}

export function exitPreviewRoom(user) {
  return (dispatch) => {
    dispatch({ type: EXIT_PREVIEW_ROOM });
    leaveRoom(user);
  };
}

export function setUser(user) {
  return { type: SET_USER, user };
}

export function updateProfile(user, values) {
  return (dispatch) => {
    user.updateProfile(values).then(() => {
      dispatch(setUser({ ...user }));
    });
  };
}
