import { Branded } from "utils/types";

// NOTE: add specific branded IDs in alphabetical order
export type SpaceId = Branded<string, "SpaceId">;
export type UserId = Branded<string, "UserId">;
export type WorldId = Branded<string, "WorldId">;

// complex ID and Slug types for pinpointing spaces
export type SpaceIdLocation = { worldId: WorldId; spaceId: SpaceId };
export type SpaceSlugLocation = { worldId: WorldId; spaceId: SpaceId };
