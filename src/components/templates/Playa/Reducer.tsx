import { State, Action, ActionType } from "./Types";

export const InitialState = {
  rate: 0.1,
  center: { x: 0, y: 5, z: 10 },
};

export const Reducer = (state: State, action: Action) => {
  switch (action.type) {
    case ActionType.Move:
      return {
        ...state,
        center: {
          x: state.center.x + (action.payload.x || 0),
          y: state.center.y + (action.payload.y || 0),
          z: state.center.z + (action.payload.z || 0),
        },
        rate: action.payload.rate || state.rate,
      };
    default:
      return state;
  }
};
