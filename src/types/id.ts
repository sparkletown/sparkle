import { World } from "api/world";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
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
export type WorldIdLocation = { worldId: WorldId };
export type WorldSlugLocation = { worldSlug: WorldSlug };

// Simplified versions to ease future move of WithId<> type from utils
export type SpaceWithoutId = AnyVenue;
export type SpaceWithId = WithId<AnyVenue>;
export type Spaces = WithId<AnyVenue>[];
export type WorldWithoutId = World;
export type WorldWithId = WithId<World>;
export type Worlds = WithId<WorldWithId>[];
