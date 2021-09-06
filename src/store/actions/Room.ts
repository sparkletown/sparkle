export const PREVIEW_ROOM = "PREVIEW_ROOM";
export const EXIT_PREVIEW_ROOM = "EXIT_PREVIEW_ROOM";
export const TOGGLE_MUTE_REACTIONS = "TOGGLE_MUTE_REACTIONS";

export interface ExitRoomAction {
  type: typeof EXIT_PREVIEW_ROOM;
}

export interface PreviewRoomAction {
  type: typeof PREVIEW_ROOM;
  room: string;
}

export interface ToggleMuteAction {
  type: typeof TOGGLE_MUTE_REACTIONS;
}

export type RoomActions = ExitRoomAction | PreviewRoomAction | ToggleMuteAction;
