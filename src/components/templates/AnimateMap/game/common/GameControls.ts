import { GameConfig } from "./GameConfig";
import { GamePoint } from "./GamePoint";

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
  playgroundMap: {
    pointIsOnThePlayground: (x: number, y: number) => boolean;
    pointIsInTheOuterCircle: (x: number, y: number) => boolean;
    getPointIfBoundingPlaygroundBorder: (
      x1: number,
      y1: number,
      x2: number,
      y2: number
    ) => GamePoint | undefined;
    getRandomPointInTheCentralCircle: () => GamePoint;
    getRandomPointOnThePlayground: () => GamePoint;
  };
  dispatch: (data: { type: string }) => void;
  getUsers: () => Map<string, GameUser>;
  getEnvironmentSound: () => object;
  getZoomLevel: () => number;
  getLastZoom: () => number;
  getConfig: () => GameConfig;
};
