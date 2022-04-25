import { ReduxAction } from "types/redux";

import { GameUser } from "./GameControls";
import { GamePoint } from "./GamePoint";

export enum GameActionTypes {
  SET_STAGE_OPTIONS = "AnimateMapActionTypes.SET_STAGE_OPTIONS",
  SET_ZOOM_LEVEL = "AnimateMapActionTypes.SET_ZOOM_LEVEL",
  SET_LAST_ZOOM = "AnimateMapActionTypes.SET_LAST_ZOOM",
  SET_FIRST_ENTRANCE = "AnimateMapActionTypes.SET_FIRST_ENTRANCE",
  SET_EXPECTED_ZOOM = "AnimateMapActionTypes.SET_EXPECTED_ZOOM",
  SET_CAMERA_RECT = "AnimateMapActionTypes.SET_CAMERA_RECT",
  SET_POINTER = "AnimateMapActionTypes.SET_POINTER",
  SET_ROOM = "AnimateMapActionTypes.SET_ROOM",
  SET_HERO = "AnimateMapActionTypes.SET_HERO",
  SET_JOYSTICK = "AnimateMapActionTypes.SET_JOYSTICK",
  SET_USERS = "AnimateMapActionTypes.SET_USERS",
  SET_VENUES = "AnimateMapActionTypes.SET_VENUES",

  SET_ENVIRONMENT_SOUND = "AnimateMapActionTypes.SET_ENVIRONMENT_SOUND",

  SET_FIREBARREL = "AnimateMapActionTypes.SET_FIREBARREL",
  ENTER_FIREBARREL = "AnimateMapActionTypes.ENTER_FIREBARREL",
  EXIT_FIREBARREL = "AnimateMapActionTypes.EXIT_FIREBARREL",
  UPDATE_FIREBARREL = "AnimateMapActionTypes.UPDATE_FIREBARREL",
}

export type setAnimateMapEnvironmentSoundAction = ReduxAction<
  GameActionTypes.SET_ENVIRONMENT_SOUND,
  {
    environmentSound: boolean;
  }
>;

export type setAnimateMapLastZoomAction = ReduxAction<
  GameActionTypes.SET_LAST_ZOOM,
  {
    lastZoom: number;
  }
>;

export type setAnimateMapZoomAction = ReduxAction<
  GameActionTypes.SET_ZOOM_LEVEL,
  {
    zoomLevel: number;
  }
>;

export type setAnimateMapPointerAction = ReduxAction<
  GameActionTypes.SET_POINTER,
  {
    pointer: GamePoint;
  }
>;

export type setAnimateMapFirstEntranceAction = ReduxAction<
  GameActionTypes.SET_FIRST_ENTRANCE,
  {
    firstEntrance: string;
  }
>;

export type setAnimateMapUsersAction = ReduxAction<
  GameActionTypes.SET_USERS,
  {
    users: Map<string, GameUser>;
  }
>;

export const setAnimateMapLastZoom = (
  lastZoom: number
): setAnimateMapLastZoomAction => ({
  type: GameActionTypes.SET_LAST_ZOOM,
  payload: { lastZoom },
});

export const setAnimateMapZoom = (zoom: number): setAnimateMapZoomAction => ({
  type: GameActionTypes.SET_ZOOM_LEVEL,
  payload: { zoomLevel: zoom },
});

export const setAnimateMapPointer = (
  pointer: GamePoint
): setAnimateMapPointerAction => ({
  type: GameActionTypes.SET_POINTER,
  payload: { pointer },
});

export const setAnimateMapFirstEntrance = (
  firstEntrance: string
): setAnimateMapFirstEntranceAction => ({
  type: GameActionTypes.SET_FIRST_ENTRANCE,
  payload: { firstEntrance },
});

export const setAnimateMapUsers = (
  users: Map<string, GameUser>
): setAnimateMapUsersAction => ({
  type: GameActionTypes.SET_USERS,
  payload: { users },
});
