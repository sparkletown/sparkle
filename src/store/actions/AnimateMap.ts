import { AnimateMapStageOptions } from "../reducers/AnimateMap";
import { ReduxAction } from "../../types/redux";

export enum AnimateMapActionTypes {
  UPDATE_ANIMATE_MAP_STAGE_OPTIONS = "UPDATE_ANIMATE_MAP_STAGE_OPTIONS",
}

export type setAnimateMapStageOptionsAction = ReduxAction<
  AnimateMapActionTypes.UPDATE_ANIMATE_MAP_STAGE_OPTIONS,
  VenueAnimateMapStageOptions
>;

export type VenueAnimateMapStageOptions = {
  options: AnimateMapStageOptions;
};

export const updateAnimateMapStageOptions = (
  options?: AnimateMapStageOptions
): setAnimateMapStageOptionsAction => ({
  type: AnimateMapActionTypes.UPDATE_ANIMATE_MAP_STAGE_OPTIONS,
  payload: { options },
});

export type AnimateMapActions = setAnimateMapStageOptionsAction;
