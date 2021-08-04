import {
  AnimateMapActions,
  AnimateMapActionTypes,
} from "store/actions/AnimateMap";
import { Reducer } from "redux";
import { Box, QuadTree } from "js-quadtree";
import { Room } from "types/rooms";
import {
  Point,
  StartPoint,
} from "components/templates/AnimateMap/game/utils/Point";

export enum AnimateMapEntityType {
  user,
  venue,
  userWithControls,
}

export interface AnimateMapEntity {
  type: AnimateMapEntityType;
  id: string;
  x: number;
  y: number;
  data: ReplicatedUserData | ReplicatedVenueData;
}

export interface ReplicatedUserData {
  videoUrlString: string;
  avatarUrlString: string | string[];
  dotColor: number; //hex
  hat: string | null;
  accessories: string | null;
  cycle: string | null;
}

export interface ReplicatedUser extends AnimateMapEntity {
  data: ReplicatedUserData;
}

export interface ReplicatedVenueData {
  url: string;
  videoUrlString: string;
  imageUrlString: string;
}

export interface ReplicatedVenue extends AnimateMapEntity {
  data: ReplicatedVenueData;
}

export class PlayerModel implements ReplicatedUser {
  data: ReplicatedUserData = {
    videoUrlString: "",
    avatarUrlString: "",
    dotColor: Math.floor(Math.random() * 16777215),
    hat: null,
    accessories: null,
    cycle: null,
  };
  id: string = "";
  type: AnimateMapEntityType = AnimateMapEntityType.userWithControls;
  x: number = 4960;
  y: number = 4960;
}

export interface AnimateMapState {
  zoom: number;
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
  //flags
  firstEntrance: string | null;
  environmentSound: boolean;
}

const initialAnimateMapState: AnimateMapState = {
  zoom: 2,
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
  //flags
  firstEntrance: window.sessionStorage.getItem(
    "AnimateMapState.sessionStorage"
  ),
  environmentSound: true,
};

export type AnimateMapReducer = Reducer<AnimateMapState, AnimateMapActions>;

export const animateMapReducer: AnimateMapReducer = (
  state = initialAnimateMapState,
  action: AnimateMapActions
): AnimateMapState => {
  const immutableState = state;

  switch (action.type) {
    case AnimateMapActionTypes.SET_ZOOM:
      const { zoom } = action.payload;
      return { ...immutableState, zoom: zoom };

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
