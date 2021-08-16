import omit from "lodash/omit";

// @debt Move this file into types/ or possibly even merge it with types/utility.ts

export type WithId<T extends Record<string, unknown>> = T & { id: string };

export const withId = <T extends Record<string, unknown>>(
  obj: T,
  id: string
): WithId<T> => ({
  ...obj,
  id,
});

export type WithoutId<T extends Record<string, unknown>> = Pick<
  T,
  Exclude<keyof T, "id">
>;

export const withoutId = <T extends Record<string, unknown>>(
  obj: T
): WithoutId<T> => omit(obj, "id");

export type WithVenueId<T extends Record<string, unknown>> = T & {
  venueId: string;
};

export const withVenueId = <T extends Record<string, unknown>>(
  obj: T,
  venueId: string
): WithVenueId<T> => ({
  ...obj,
  venueId,
});
