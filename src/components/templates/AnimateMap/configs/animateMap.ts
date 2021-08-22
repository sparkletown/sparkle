import { MAP_IMAGE } from "../game/constants/AssetConstants";

import { GameConfig } from "./GameConfig";

export const animateMapConfig = new GameConfig({
  worldWidth: 1440,
  worldHeight: 1440,
  backgroundImage: MAP_IMAGE,
});
