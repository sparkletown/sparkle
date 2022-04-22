import { World } from "api/world";

import { User } from "types/User";
import {
  AnyVenue,
  ArtPieceVenue,
  AuditoriumVenue,
  Channel,
  ExperimentalVenue,
  GenericVenue,
  JazzbarVenue,
  MeetingRoomVenue,
  PartyMapVenue,
  PosterPageVenue,
  WorldEvent,
} from "types/venues";

import { WithId } from "utils/id";
import { Branded } from "utils/types";

// NOTE: add specific branded strings in alphabetical order
export type DeferredAction = Branded<symbol, "DeferredAction">;
export type ElementId = Branded<string, "ElementId">;
export type SpaceId = Branded<string, "SpaceId">;
export type SpaceSlug = Branded<string, "SpaceSlug">;
export type UserId = Branded<string, "UserId">;
export type WorldId = Branded<string, "WorldId">;
export type WorldEventId = Branded<string, "WorldEventId">;
export type WorldSlug = Branded<string, "WorldSlug">;

// complex ID and Slug types for pinpointing spaces
export type SpaceIdLocation = { spaceId: SpaceId };
export type SpaceSlugLocation = { worldSlug: WorldSlug; spaceSlug: SpaceSlug };
export type SpacesSlugLocation = { spaceSlug: SpaceSlug };
export type WorldIdLocation = { worldId: WorldId };
export type WorldSlugLocation = { worldSlug: WorldSlug };
export type WorldAndSpaceIdLocation = { worldId: WorldId; spaceId: SpaceId };
export type WorldAndSpaceSlugLocation = {
  worldSlug: WorldSlug;
  spaceSlug: SpaceSlug;
};

// partials for cases where not all data is present
export type MaybeSpaceIdLocation = Partial<SpaceIdLocation>;
export type MaybeSpacesSlugLocation = Partial<SpacesSlugLocation>;
export type MaybeWorldIdLocation = Partial<WorldIdLocation>;
export type MaybeWorldSlugLocation = Partial<WorldSlugLocation>;
export type MaybeWorldAndSpaceIdLocation = Partial<WorldAndSpaceIdLocation>;
export type MaybeWorldAndSpaceSlugLocation = Partial<WorldAndSpaceSlugLocation>;

// Simplified versions to ease future move of WithId<> type from utils
// please keep this list alphabetically sorted
export type ArtPieceSpaceWithId = WithId<ArtPieceVenue, SpaceId>;
export type AuditoriumSpaceWithId = WithId<AuditoriumVenue, SpaceId>;
export type ExperimentalSpaceWithId = WithId<ExperimentalVenue, SpaceId>;
export type GenericSpaceWithId = WithId<GenericVenue, SpaceId>;
export type JazzBarSpaceWithId = WithId<JazzbarVenue, SpaceId>;
export type MeetingRoomSpaceWithId = WithId<MeetingRoomVenue, SpaceId>;
export type PartyMapSpaceWithId = WithId<PartyMapVenue, SpaceId>;
export type PosterPageSpaceWithId = WithId<PosterPageVenue, SpaceId>;
export type SpaceWithId = WithId<AnyVenue, SpaceId>;
export type SpaceWithoutId = AnyVenue;

export type WorldWithoutId = World;
export type WorldWithId = WithId<World, WorldId>;
export type Worlds = WithId<WorldWithId>[];

export type UserWithId = WithId<User, UserId>;
export type Users = WithId<User, UserId>[];

export type WorldEventWithId = WithId<WorldEvent, WorldEventId>;

export type HasOptionalChannels = {
  channels?: Channel[];
};
