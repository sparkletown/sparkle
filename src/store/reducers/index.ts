import { RoomActions, LocationActions } from "../actions";

interface RoomState {
  room: string | null;
  mute: boolean;
}

interface LocationState {
  x: number | undefined;
  y: number | undefined;
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

const initialLocationState: LocationState = { x: undefined, y: undefined };

export const locationReducer = (
  state = initialLocationState,
  action: LocationActions
): LocationState => {
  switch (action.type) {
    case "UPDATE_LOCATION":
      return { ...state, x: action.x, y: action.y };
    default:
      return state;
  }
};
