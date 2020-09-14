import { LocationActions } from "../actions/Location";

interface LocationState {
  x: number | undefined;
  y: number | undefined;
}

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
