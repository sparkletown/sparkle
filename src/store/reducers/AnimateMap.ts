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
  worldWidth: number;
  worldHeight: number;
  zoom: number;
}

const initialAnimateMapState: AnimateMapState = {
  stageOptions: {
    backgroundColor: 0x10bb99,
    antialias: true,
    autoDensity: true,
    resizeTo: undefined,
  },
  worldWidth: 9920,
  worldHeight: 9920,
  zoom: 1,
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

    case AnimateMapActionTypes.UPDATE_ZOOM:
      const { zoom } = action.payload;
      return { ...state, zoom: zoom };

    default:
      return state;
  }
};
