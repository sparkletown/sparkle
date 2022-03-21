import { Firebarrel } from "types/animateMap";
import { ReduxAction } from "types/redux";
import { Room } from "types/rooms";
import { User } from "types/User";

export enum AnimateMapActionTypes {
  SET_ENVIRONMENT_SOUND = "AnimateMapActionTypes.SET_ENVIRONMENT_SOUND"
}

export type setAnimateMapEnvironmentSoundAction = ReduxAction<AnimateMapActionTypes.SET_ENVIRONMENT_SOUND,
  {
    environmentSound: boolean;
  }>;

export type ReplicatedFirebarrel = {
  x: number;
  y: number;
  data: ReplicatedFirebarrelData;
}
export type ReplicatedFirebarrelData = Firebarrel & {
  connectedUsers?: string[];
}

export type ReplicatedUser =  {
  x: number;
  y: number;
  data: ReplicatedUserData;
}
export type ReplicatedUserData = User & {
  id: string;
  partyName?: string;
  messengerId: number; //playerio messager id
  pictureUrl?: string;
  dotColor: number; //hex
  hat?: string;
  accessories?: string;
  cycle?: string;
}

export type ReplicatedVenue = {
  x: number;
  y: number;
  data: ReplicatedVenueData;
}
export type ReplicatedVenueData = Room & {
  id: number;
  isLive: boolean;
  countUsers: number;
  withoutPlate?: boolean;
}
