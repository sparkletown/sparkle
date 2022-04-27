import { GameConfigOptions } from "common/AnimateMap/game/common";

import { BaseVenue } from "types/venues";
import { VenueTemplate } from "types/VenueTemplate";

import { SpaceId } from "./AnimateMapIds";

export interface AnimateMapVenueItem extends BaseVenue {
  id: string;
  gameOptions: GameConfigOptions;
  relatedPartymapId: SpaceId;
  template: VenueTemplate.animatemap;
}
