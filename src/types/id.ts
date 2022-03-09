import { World } from "api/world";

import { User } from "types/User";
import { AnyVenue, WorldEvent } from "types/venues";

import { WithId } from "utils/id";
import { Branded } from "utils/types";

// NOTE: add specific branded strings in alphabetical order
export type SpaceId = Branded<string, "SpaceId">;
export type SpaceSlug = Branded<string, "SpaceSlug">;
export type UserId = Branded<string, "UserId">;
export type WorldId = Branded<string, "WorldId">;
export type WorldEventId = Branded<string, "WorldEventId">;
export type WorldSlug = Branded<string, "WorldSlug">;

// complex ID and Slug types for pinpointing spaces
export type SpaceIdLocation = { spaceId: SpaceId };
export type MaybeSpaceIdLocation = { spaceId?: SpaceId };
export type SpaceSlugLocation = { worldSlug: WorldSlug; spaceSlug: SpaceSlug };
export type SpacesSlugLocation = { spaceSlug: SpaceSlug };
export type WorldIdLocation = { worldId: WorldId };
export type MaybeWorldIdLocation = { worldId?: WorldId };
export type MaybeWorldAndSpaceSlugLocation = {
  worldSlug?: WorldSlug;
  spaceSlug?: SpaceSlug;
};
export type WorldSlugLocation = { worldSlug: WorldSlug };
export type WorldAndSpaceIdLocation = { worldId: WorldId; spaceId: SpaceId };
export type WorldAndSpaceSlugLocation = {
  worldSlug: WorldSlug;
  spaceSlug: SpaceSlug;
};

// Simplified versions to ease future move of WithId<> type from utils
export type SpaceWithoutId = AnyVenue;
export type SpaceWithId = WithId<AnyVenue, SpaceId>;
export type Spaces = WithId<AnyVenue>[];

export type WorldWithoutId = World;
export type WorldWithId = WithId<World, WorldId>;
export type Worlds = WithId<WorldWithId>[];

export type UserWithId = WithId<User, UserId>;
export type Users = WithId<User, UserId>[];

export type WorldEventWithId = WithId<WorldEvent, WorldEventId>;
