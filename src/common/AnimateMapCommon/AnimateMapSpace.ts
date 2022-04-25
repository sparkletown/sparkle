import { AnimateMapGameOptions } from "../AnimateMapConfig";

import { SpaceId } from "./AnimateMapIds";

export type AnimateMapSpace = {
  id: string;
  gameOptions: AnimateMapGameOptions;
  relatedPartymapId: SpaceId;
  playerioGameId: string;
  playerioMaxPlayerPerRoom?: number;
  playerioFrequencyUpdate?: number;
  worldId: string;
};
