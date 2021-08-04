import { ReplicatedUser, ReplicatedVenue, } from "store/reducers/AnimateMap";
import { ReduxAction } from "types/redux";
import { Box } from "js-quadtree";
import { Point } from "components/templates/AnimateMap/game/utils/Point";
import { Room } from "types/rooms";

export enum AnimateMapActionTypes {
  SET_STAGE_OPTIONS = "AnimateMapActionTypes.SET_STAGE_OPTIONS",
  SET_ZOOM = "AnimateMapActionTypes.SET_ZOOM",
  SET_EXPECTED_ZOOM = "AnimateMapActionTypes.SET_EXPECTED_ZOOM",
  SET_CAMERA_RECT = "AnimateMapActionTypes.SET_CAMERA_RECT",
  SET_POINTER = "AnimateMapActionTypes.SET_POINTER",
  SET_ROOM = "AnimateMapActionTypes.SET_ROOM",
  SET_HERO = "AnimateMapActionTypes.SET_HERO",
  SET_JOYSTICK = "AnimateMapActionTypes.SET_JOYSTICK",
  SET_USERS = "AnimateMapActionTypes.SET_USERS",
  SET_VENUES = "AnimateMapActionTypes.SET_VENUES",

  SET_ENVIRONMENT_SOUND = "AnimateMapActionTypes.SET_ENVIRONMENT_SOUND",
}

export type setAnimateMapZoomAction = ReduxAction<
  AnimateMapActionTypes.SET_ZOOM,
  {
    zoom: number;
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

export const setAnimateMapZoom = (zoom: number): setAnimateMapZoomAction => ({
  type: AnimateMapActionTypes.SET_ZOOM,
  payload: { zoom },
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

export type AnimateMapActions =
  | setAnimateMapZoomAction
  | setAnimateMapExpectedZoomAction
  | setAnimateMapCameraRectAction
  | setAnimateMapPointerAction
  | setAnimateMapRoomAction
  | setAnimateMapHeroAction
  | setAnimateMapUsersAction
  | setAnimateMapVenuesAction
  | setAnimateMapEnvironmentSoundAction;
