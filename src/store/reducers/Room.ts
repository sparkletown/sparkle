import {
  EXIT_PREVIEW_ROOM,
  PREVIEW_ROOM,
  RoomActions,
  TOGGLE_MUTE_REACTIONS,
} from "store/actions/Room";

export interface RoomState {
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
    // @debt is this even used currently?
    case PREVIEW_ROOM:
      return { ...state, room: action.room };

    // @debt is this even used currently?
    case EXIT_PREVIEW_ROOM:
      return { room: null, mute: false };

    // @debt is this even used currently?
    case TOGGLE_MUTE_REACTIONS:
      return { ...state, mute: !state.mute };

    default:
      return state;
  }
};
