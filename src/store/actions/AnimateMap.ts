import { AnimateMapStageOptions } from "../reducers/AnimateMap";
import { ReduxAction } from "../../types/redux";

export enum AnimateMapActionTypes {
  UPDATE_ANIMATE_MAP_STAGE_OPTIONS = "UPDATE_ANIMATE_MAP_STAGE_OPTIONS",
  UPDATE_ZOOM = "UPDATE_ZOOM",
}

export type setAnimateMapStageOptionsAction = ReduxAction<
  AnimateMapActionTypes.UPDATE_ANIMATE_MAP_STAGE_OPTIONS,
  {
    options: AnimateMapStageOptions;
  }
>;
export type updateAnimateMapZoomAction = ReduxAction<
  AnimateMapActionTypes.UPDATE_ZOOM,
  {
    zoom: number;
  }
>;

export const updateAnimateMapStageOptions = (
  options?: AnimateMapStageOptions
): setAnimateMapStageOptionsAction => ({
  type: AnimateMapActionTypes.UPDATE_ANIMATE_MAP_STAGE_OPTIONS,
  payload: { options },
});

export const updateAnimateMapZoom = (
  zoom: number
): updateAnimateMapZoomAction => ({
  type: AnimateMapActionTypes.UPDATE_ZOOM,
  payload: { zoom },
});

export type AnimateMapActions =
  | setAnimateMapStageOptionsAction
  | updateAnimateMapZoomAction;
