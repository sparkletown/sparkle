import { MAP_IMAGE } from "../game/constants/AssetConstants";

import { GameConfig } from "./GameConfig";

export const animateMapConfig = new GameConfig({
  worldWidth: 9920,
  worldHeight: 9920,
  backgroundImage: MAP_IMAGE,
});
