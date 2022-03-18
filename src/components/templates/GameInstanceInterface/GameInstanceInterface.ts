import { Renderer } from "pixi.js";

import { GameConfig } from "../AnimateMap/configs/GameConfig";
import { MapContainer } from "../AnimateMap/game/map/MapContainer";
import { DataProvider } from "../DataProvider";
import { GameInstanceProvider } from "../GameInstanceProvider";

export type GameInstanceInterface = {
  gameInstanceProvider: GameInstanceProvider;
  dataProvider: DataProvider;
  init: () => Promise<void>;
  start: () => Promise<void>;
  release: () => Promise<void>;
  getConfig: () => GameConfig;
  getMapContainer: () => MapContainer | undefined;
  getRenderer: () => Renderer | undefined;
}
