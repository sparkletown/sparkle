import { Branded } from "utils/types";

// NOTE: add specific branded IDs in alphabetical order
export type UserId = Branded<string, "UserId">;
export type WorldId = Branded<string, "WorldId">;
