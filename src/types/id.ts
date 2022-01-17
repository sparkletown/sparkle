import { Branded } from "utils/types";

// NOTE: add specific branded strings in alphabetical order
export type SpaceId = Branded<string, "SpaceId">;
export type SpaceSlug = Branded<string, "SpaceSlug">;
export type UserId = Branded<string, "UserId">;
export type WorldId = Branded<string, "WorldId">;
export type WorldSlug = Branded<string, "WorldSlug">;

// complex ID and Slug types for pinpointing spaces
export type SpaceIdLocation = { worldId: WorldId; spaceId: SpaceId };
export type SpaceSlugLocation = { worldSlug: WorldSlug; spaceSlug: SpaceSlug };
