import { GameConfig } from "./GameConfig";

export type GameUserData = {
  id: string;
  partyName?: string;
  messengerId: number; //playerio messager id
  pictureUrl?: string;
  dotColor: number; //hex
  hat?: string;
  accessories?: string;
  cycle?: string;
};

export type GameUser = {
  data: GameUserData;
  x: number;
  y: number;
};

export type GameControls = {
  dispatch: (data: { type: string }) => void;
  getUsers: () => Array<GameUser>;
  getEnvironmentSound: () => object;
  getZoomLevel: () => number;
  getLastZoom: () => number;
  getConfig: () => GameConfig;
};
