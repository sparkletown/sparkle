import { Box, QuadTree } from "js-quadtree";
import { Reducer } from "redux";

import {
  AnimateMapActions,
  AnimateMapActionTypes,
} from "store/actions/AnimateMap";

import { Room } from "types/rooms";
import { Point } from "types/utility";

import { StartPoint } from "components/templates/AnimateMap/game/utils/Point";
import {
  AnimateMapFirebarrel,
  AnimateMapUser,
  AnimateMapUserData,
  AnimateMapVenue,
} from "components/templates/AnimateMapCommon";

export type ReplicatedUser = AnimateMapUser;

export interface ReplicatedArtcar extends ReplicatedVenue {
  radiusX: number;
  radiusY: number;
  angle: number;
  color: number;
  colorIndex: number;
}

export type ReplicatedVenue = AnimateMapVenue;

export type ReplicatedFirebarrel = AnimateMapFirebarrel;

export class PlayerModel implements ReplicatedUser {
  public data: AnimateMapUserData = {
    id: "",
    partyName: "",
    messengerId: 0,
    pictureUrl: "",
    dotColor: Math.floor(Math.random() * 16777215),
  };

  public constructor(
    id: string,
    messengerId: number,
    avatarUrlString: string,
    public x: number = 9920 / 2,
    public y: number = 9920 / 2
  ) {
    this.data.id = id;
    this.data.messengerId = messengerId;
    this.data.pictureUrl = avatarUrlString;
  }
}

export interface AnimateMapState {
  zoomLevel: number;
  room: Room | null;
  expectedZoom: number;
  cameraRect: Box;
  pointer: Point;
  hero: ReplicatedUser | null;
  users: Map<string, ReplicatedUser>;
  replicatedUsers: Map<string, ReplicatedUser>;
  venues: Map<string, ReplicatedVenue>;
  usersQT: QuadTree | null;
  venuesQT: QuadTree | null;
  lastZoom: number;
  //flags
  firstEntrance: string | null;
  environmentSound: boolean;
}

const lastZoom = window.sessionStorage.getItem("AnimateMapState.lastZoom");

const initialAnimateMapState: AnimateMapState = {
  zoomLevel: 2,
  room: null,
  expectedZoom: 2,
  cameraRect: new Box(0, 0, 0, 0),
  pointer: StartPoint(),
  hero: null,
  users: new Map<string, ReplicatedUser>(),
  replicatedUsers: new Map<string, ReplicatedUser>(),
  venues: new Map<string, ReplicatedVenue>(),
  usersQT: null,
  venuesQT: null,
  lastZoom: lastZoom ? parseFloat(lastZoom) : 1,
  //flags
  firstEntrance: window.sessionStorage.getItem("AnimateMapState.firstEntrance"),
  environmentSound: true,
};

export type AnimateMapReducer = Reducer<AnimateMapState, AnimateMapActions>;

export const animateMapReducer: AnimateMapReducer = (
  state = initialAnimateMapState,
  action: AnimateMapActions
): AnimateMapState => {
  const immutableState = state;

  switch (action.type) {
    case AnimateMapActionTypes.SET_ZOOM_LEVEL:
      const { zoomLevel } = action.payload;
      return { ...immutableState, zoomLevel: zoomLevel };

    case AnimateMapActionTypes.SET_LAST_ZOOM:
      const { lastZoom } = action.payload;
      window.sessionStorage.setItem(
        "AnimateMapState.lastZoom",
        lastZoom.toString()
      );
      return { ...immutableState, lastZoom: lastZoom };

    case AnimateMapActionTypes.SET_FIRST_ENTRANCE:
      const { firstEntrance } = action.payload;
      console.log("SAVE firstEntrance ", firstEntrance);
      window.sessionStorage.setItem(
        "AnimateMapState.firstEntrance",
        firstEntrance
      );
      return { ...immutableState, firstEntrance: firstEntrance };

    case AnimateMapActionTypes.SET_EXPECTED_ZOOM:
      const { expectedZoom } = action.payload;
      return { ...immutableState, expectedZoom: expectedZoom };

    case AnimateMapActionTypes.SET_CAMERA_RECT:
      const { cameraRect } = action.payload;
      return { ...immutableState, cameraRect: cameraRect };

    case AnimateMapActionTypes.SET_POINTER:
      const { pointer } = action.payload;
      return { ...immutableState, pointer: pointer };

    case AnimateMapActionTypes.SET_ROOM:
      const { room } = action.payload;
      return { ...immutableState, room: room };

    case AnimateMapActionTypes.SET_HERO:
      const { hero } = action.payload;
      return { ...immutableState, hero: hero };

    case AnimateMapActionTypes.SET_USERS:
      const { users } = action.payload;
      return { ...immutableState, users: users };

    case AnimateMapActionTypes.SET_VENUES:
      const { venues } = action.payload;
      return { ...immutableState, venues: venues };

    case AnimateMapActionTypes.SET_ENVIRONMENT_SOUND:
      const { environmentSound } = action.payload;
      return { ...immutableState, environmentSound: environmentSound };

    default:
      return state;
  }
};
