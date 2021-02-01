import { ToggleButtonGroup } from "react-bootstrap";

export const PREVIEW_ROOM = "PREVIEW_ROOM";
export const EXIT_PREVIEW_ROOM = "EXIT_PREVIEW_ROOM";
export const TOGGLE_MUTE_REACTIONS = "TOGGLE_MUTE_REACTIONS";

interface ExitRoomAction {
  type: typeof EXIT_PREVIEW_ROOM;
}

interface PreviewRoomAction {
  type: typeof PREVIEW_ROOM;
  room: string;
}

interface ToggleMuteAction {
  type: typeof ToggleButtonGroup;
}

export type RoomActions = ExitRoomAction | PreviewRoomAction | ToggleMuteAction;
