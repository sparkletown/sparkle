import omit from "lodash/omit";

// @debt Move this file into types/ or possibly even merge it with types/utility.ts

export type WithId<T extends object> = T & { id: string };

export const withId = <T extends object>(obj: T, id: string): WithId<T> => ({
  ...obj,
  id,
});

export type WithoutId<T extends object> = Pick<T, Exclude<keyof T, "id">>;

export const withoutId = <T extends object>(obj: T): WithoutId<T> =>
  omit(obj, "id");

export type WithVenueId<T extends object> = T & { venueId: string };

export const withVenueId = <T extends object>(
  obj: T,
  venueId: string
): WithVenueId<T> => ({
  ...obj,
  venueId,
});
