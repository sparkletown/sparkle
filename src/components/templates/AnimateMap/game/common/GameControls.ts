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

export type GameArtCarData = {
  title: string;
  id: number;
  image_url: string;
  isLive: boolean;
  url: string;
  about?: string;
  isEnabled: boolean;
  countUsers: number;
  subtitle?: string;
  width_percent: number;
  height_percent: number;
  x_percent: number;
  y_percent: number;
};

export type GameArtcar = {
  data: GameArtCarData;
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
  angle: number;
  color: number;
  colorIndex: number;
};

export type GameFirebarellData = {
  id: string;
  iconSrc: string;
  connectedUsers?: string[];
};

export type GameFirebarell = {
  x: number;
  y: number;
  data: GameFirebarellData;
};

export type GameVenueData = {
  id: number;
  title: string;
  image_url: string;
  isLive: boolean;
  countUsers: number;
  withoutPlate?: boolean;
  subtitle?: string;
  url: string;
  about?: string;
  isEnabled: boolean;
  width_percent: number;
  height_percent: number;
  x_percent: number;
  y_percent: number;
};

export type GameVenue = {
  data: GameVenueData;
  x: number;
  y: number;
};

export interface GameState {
  firstEntrance: string | null;
}

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
