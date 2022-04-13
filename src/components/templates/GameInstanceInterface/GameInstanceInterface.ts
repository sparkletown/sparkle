import { Renderer } from "pixi.js";

import { DataProvider } from "../DataProvider";
import { GameConfig } from "../GameConfig/GameConfig";
import { MapContainer } from "../GameInstance/map/MapContainer";
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
};
