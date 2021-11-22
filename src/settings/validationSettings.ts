import { VenuePlacement } from "types/venues";

import { PLAYA_HEIGHT, PLAYA_VENUE_SIZE, PLAYA_WIDTH } from "./playaSettings";

export const COMMON_NAME_MAX_CHAR_COUNT = 50;
export const COMMON_NAME_MIN_CHAR_COUNT = 3;

export const COMMON_STRING_MIN_CHAR_COUNT = 3;
export const COMMON_STRING_MIN_CHAR_COUNT_RE = new RegExp(
  `.{${COMMON_STRING_MIN_CHAR_COUNT},}`
);

export const START_DATE_FORMAT_RE = /\d{4}-\d{2}-\d{2}/;

export const DEFAULT_MAP_ICON_PLACEMENT: Omit<VenuePlacement, "state"> = {
  x: (PLAYA_WIDTH - PLAYA_VENUE_SIZE) / 2,
  y: (PLAYA_HEIGHT - PLAYA_VENUE_SIZE) / 2,
};
Object.freeze(DEFAULT_MAP_ICON_PLACEMENT);
