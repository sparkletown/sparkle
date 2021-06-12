import {
  AnimateMapActions,
  AnimateMapActionTypes,
} from "../actions/AnimateMap";
import { Reducer } from "redux";
import * as PIXI from "pixi.js";
import { LastInTuple } from "react-pixi-fiber";

export type AnimateMapStageOptions = LastInTuple<
  ConstructorParameters<typeof PIXI.Application>
>; //Note: maybe relocate to src/types/AnimateMapVenue in the future

interface AnimateMapState {
  stageOptions: AnimateMapStageOptions;
}

const initialAnimateMapState: AnimateMapState = {
  stageOptions: {
    backgroundColor: 0x10bb99,
    antialias: true,
    autoDensity: true,
    resizeTo: undefined,
  },
};

export type AnimateMapReducer = Reducer<AnimateMapState, AnimateMapActions>;

export const animateMapReducer: AnimateMapReducer = (
  state = initialAnimateMapState,
  action: AnimateMapActions
): AnimateMapState => {
  switch (action.type) {
    case AnimateMapActionTypes.UPDATE_ANIMATE_MAP_STAGE_OPTIONS:
      const { options } = action.payload;
      return { ...state, stageOptions: options };
    default:
      return state;
  }
};
