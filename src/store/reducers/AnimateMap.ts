import {
  AnimateMapActions,
  AnimateMapActionTypes,
} from "../actions/AnimateMap";
import { Reducer } from "redux";
import * as PIXI from "pixi.js";

// Gets the length of an array/tuple type.
// see: https://dev.to/kjleitz/comment/gb5d
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LengthOfTuple<T extends any[]> = T extends { length: infer L } ? L : never;

// Drops the first element of a tuple.
// see: https://dev.to/kjleitz/comment/gb5d
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DropFirstInTuple<T extends any[]> = T extends [arg: any, ...rest: infer U]
  ? U
  : T;

// Gets the type of the last element of a tuple.
// see: https://dev.to/kjleitz/comment/gb5d
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type LastInTuple<T extends any[]> = T[LengthOfTuple<DropFirstInTuple<T>>];

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
