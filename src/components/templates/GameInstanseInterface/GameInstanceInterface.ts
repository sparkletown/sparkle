import { Renderer } from "pixi.js";
import { Store } from "redux";

import { AnimateMapState } from "store/reducers/AnimateMap";

import { GameConfig } from "../AnimateMap/configs/GameConfig";
import { MapContainer } from "../AnimateMap/game/map/MapContainer";

export type GameInstanceInterface = {
  init: () => Promise<void>;
  start: () => Promise<void>;
  release: () => Promise<void>;
  getStore: () => Store;
  getState: () => AnimateMapState;
  getConfig: () => GameConfig;
  getMapContainer: () => MapContainer | undefined;
  getRenderer: () => Renderer | undefined;
}
