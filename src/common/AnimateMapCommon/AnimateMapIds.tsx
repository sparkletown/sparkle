import { Branded } from "./utils/utils";
import { User } from "./AnimateMapUser";
import { AnyVenue } from "./AnimateMapVenues";

export type SpaceId = Branded<string, "SpaceId">;
export type UserId = Branded<string, "UserId">;
export type ElementId = Branded<string, "ElementId">;
export type WorldId = Branded<string, "WorldId">;
export type UserWithId = WithId<User, UserId>;

export type DeferredAction = Branded<symbol, "DeferredAction">;

export type WithId<T extends object, ID extends string = string> = T & {
  id: ID;
};

export const withId = <T extends object, ID extends string = string>(
  obj: T,
  id: ID
): WithId<T, ID> => ({
  ...obj,
  id,
});

export type SpaceWithId = { id: SpaceId } & AnyVenue;
