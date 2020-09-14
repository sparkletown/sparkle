import { RoomActions } from "../actions/Room";

interface RoomState {
  room: string | null;
  mute: boolean;
}

const initialRoomState: RoomState = {
  room: null,
  mute: false,
};

export const roomReducer = (
  state = initialRoomState,
  action: RoomActions
): RoomState => {
  switch (action.type) {
    case "PREVIEW_ROOM":
      return { ...state, room: action.room };
    case "EXIT_PREVIEW_ROOM":
      return { room: null, mute: false };
    case "TOGGLE_MUTE_REACTIONS":
      return { ...state, mute: !state.mute };
    default:
      return state;
  }
};
