import { Listener } from "redux-subscribe-action";

import { ReduxAction } from "types/redux";

import { AnimateMapRoom } from "./AnimateMapRoom";

export type SubscribeActionAfterListener = Listener;

export enum AnimateMapActionTypes {
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

export type setAnimateMapRoomAction = ReduxAction<
  AnimateMapActionTypes.SET_ROOM,
  {
    room: AnimateMapRoom;
  }
>;

export type setAnimateMapZoomAction = ReduxAction<
  AnimateMapActionTypes.SET_ZOOM_LEVEL,
  {
    zoomLevel: number;
  }
>;

export const setAnimateMapZoom = (zoom: number): setAnimateMapZoomAction => ({
  type: AnimateMapActionTypes.SET_ZOOM_LEVEL,
  payload: { zoomLevel: zoom },
});

export const setAnimateMapRoom = (
  room: AnimateMapRoom
): setAnimateMapRoomAction => ({
  type: AnimateMapActionTypes.SET_ROOM,
  payload: { room },
});
