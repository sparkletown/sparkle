import { leaveRoom } from "utils/useLocationUpdateEffect";

export const PREVIEW_ROOM = "PREVIEW_ROOM";
export const EXIT_PREVIEW_ROOM = "EXIT_PREVIEW_ROOM";
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
