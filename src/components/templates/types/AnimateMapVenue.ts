import { SpaceId } from "types/id";

import { GameOptions } from "./GameOptions";

export type AnimateMapVenue = {
  gameOptions: GameOptions;
  relatedPartymapId: SpaceId;
  worldId: string;
  id: string;
  playerioGameId: string;
  playerioMaxPlayerPerRoom?: number;
  playerioFrequencyUpdate?: number;
};
