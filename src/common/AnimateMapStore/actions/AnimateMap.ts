import { Box } from "js-quadtree";

import { ReduxAction } from "types/redux";
import { Room } from "types/rooms";
import { User } from "types/User";
import { Point } from "types/utility";

import { ReplicatedUser, ReplicatedVenue } from "../reducers";

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

export type setAnimateMapZoomAction = ReduxAction<
  AnimateMapActionTypes.SET_ZOOM_LEVEL,
  {
    zoomLevel: number;
  }
>;

export type setAnimateMapLastZoomAction = ReduxAction<
  AnimateMapActionTypes.SET_LAST_ZOOM,
  {
    lastZoom: number;
  }
>;

export type setAnimateMapFirstEntranceAction = ReduxAction<
  AnimateMapActionTypes.SET_FIRST_ENTRANCE,
  {
    firstEntrance: string;
  }
>;

export type setAnimateMapExpectedZoomAction = ReduxAction<
  AnimateMapActionTypes.SET_EXPECTED_ZOOM,
  {
    expectedZoom: number;
  }
>;

export type setAnimateMapCameraRectAction = ReduxAction<
  AnimateMapActionTypes.SET_CAMERA_RECT,
  {
    cameraRect: Box;
  }
>;

export type setAnimateMapPointerAction = ReduxAction<
  AnimateMapActionTypes.SET_POINTER,
  {
    pointer: Point;
  }
>;

export type setAnimateMapRoomAction = ReduxAction<
  AnimateMapActionTypes.SET_ROOM,
  {
    room: Room;
  }
>;

export type setAnimateMapHeroAction = ReduxAction<
  AnimateMapActionTypes.SET_HERO,
  {
    hero: ReplicatedUser;
  }
>;

export type setAnimateMapUsersAction = ReduxAction<
  AnimateMapActionTypes.SET_USERS,
  {
    users: Map<string, ReplicatedUser>;
  }
>;

export type setAnimateMapVenuesAction = ReduxAction<
  AnimateMapActionTypes.SET_VENUES,
  {
    venues: Map<string, ReplicatedVenue>;
  }
>;

export type setAnimateMapEnvironmentSoundAction = ReduxAction<
  AnimateMapActionTypes.SET_ENVIRONMENT_SOUND,
  {
    environmentSound: boolean;
  }
>;

export type setAnimateMapFireBarrelAction = ReduxAction<
  AnimateMapActionTypes.SET_FIREBARREL,
  {
    roomId: string;
  }
>;

export type enterAnimateMapFireBarrelAction = ReduxAction<
  AnimateMapActionTypes.ENTER_FIREBARREL,
  {
    roomId: string;
    connectedUsers: User[];
  }
>;

export type exitAnimateMapFireBarrelAction = ReduxAction<
  AnimateMapActionTypes.EXIT_FIREBARREL,
  {
    roomId: string;
  }
>;

export type updateAnimateMapFireBarrelAction = ReduxAction<
  AnimateMapActionTypes.UPDATE_FIREBARREL,
  {
    roomId: string;
    connectedUsers: User[];
  }
>;

export const setAnimateMapZoom = (zoom: number): setAnimateMapZoomAction => ({
  type: AnimateMapActionTypes.SET_ZOOM_LEVEL,
  payload: { zoomLevel: zoom },
});

export const setAnimateMapLastZoom = (
  lastZoom: number
): setAnimateMapLastZoomAction => ({
  type: AnimateMapActionTypes.SET_LAST_ZOOM,
  payload: { lastZoom },
});

export const setAnimateMapFirstEntrance = (
  firstEntrance: string
): setAnimateMapFirstEntranceAction => ({
  type: AnimateMapActionTypes.SET_FIRST_ENTRANCE,
  payload: { firstEntrance },
});

export const setAnimateMapExpectedZoom = (
  expectedZoom: number
): setAnimateMapExpectedZoomAction => ({
  type: AnimateMapActionTypes.SET_EXPECTED_ZOOM,
  payload: { expectedZoom },
});

export const setAnimateMapCameraRect = (
  cameraRect: Box
): setAnimateMapCameraRectAction => ({
  type: AnimateMapActionTypes.SET_CAMERA_RECT,
  payload: { cameraRect },
});

export const setAnimateMapPointer = (
  pointer: Point
): setAnimateMapPointerAction => ({
  type: AnimateMapActionTypes.SET_POINTER,
  payload: { pointer },
});

export const setAnimateMapRoom = (room: Room): setAnimateMapRoomAction => ({
  type: AnimateMapActionTypes.SET_ROOM,
  payload: { room },
});

export const setAnimateMapHero = (
  hero: ReplicatedUser
): setAnimateMapHeroAction => ({
  type: AnimateMapActionTypes.SET_HERO,
  payload: { hero },
});

export const setAnimateMapUsers = (
  users: Map<string, ReplicatedUser>
): setAnimateMapUsersAction => ({
  type: AnimateMapActionTypes.SET_USERS,
  payload: { users },
});

export const setAnimateMapVenues = (
  venues: Map<string, ReplicatedVenue>
): setAnimateMapVenuesAction => ({
  type: AnimateMapActionTypes.SET_VENUES,
  payload: { venues },
});

export const setAnimateMapEnvironmentSound = (
  environmentSound: boolean
): setAnimateMapEnvironmentSoundAction => ({
  type: AnimateMapActionTypes.SET_ENVIRONMENT_SOUND,
  payload: { environmentSound },
});

export const setAnimateMapFireBarrel = (
  roomId: string
): setAnimateMapFireBarrelAction => ({
  type: AnimateMapActionTypes.SET_FIREBARREL,
  payload: { roomId },
});

export const enterAnimateMapFireBarrel = (
  roomId: string,
  connectedUsers: User[]
): enterAnimateMapFireBarrelAction => ({
  type: AnimateMapActionTypes.ENTER_FIREBARREL,
  payload: { roomId, connectedUsers },
});

export const exitAnimateMapFireBarrel = (
  roomId: string
): exitAnimateMapFireBarrelAction => ({
  type: AnimateMapActionTypes.EXIT_FIREBARREL,
  payload: { roomId },
});

export const updateAnimateMapFireBarrel = (
  roomId: string,
  connectedUsers: User[]
): updateAnimateMapFireBarrelAction => ({
  type: AnimateMapActionTypes.UPDATE_FIREBARREL,
  payload: { roomId, connectedUsers },
});

export type AnimateMapActions =
  | setAnimateMapZoomAction
  | setAnimateMapLastZoomAction
  | setAnimateMapExpectedZoomAction
  | setAnimateMapFirstEntranceAction
  | setAnimateMapCameraRectAction
  | setAnimateMapPointerAction
  | setAnimateMapRoomAction
  | setAnimateMapHeroAction
  | setAnimateMapUsersAction
  | setAnimateMapVenuesAction
  | setAnimateMapEnvironmentSoundAction
  | setAnimateMapFireBarrelAction
  | enterAnimateMapFireBarrelAction
  | exitAnimateMapFireBarrelAction
  | updateAnimateMapFireBarrelAction;
