import firebase from "firebase/compat/app";
import omit from "lodash/omit";

import { WorldId } from "types/id";

// @debt Move these types in types/id.ts

export type WithId<T extends object, ID extends string = string> = T & {
  id: ID;
};
export type WithSlug<T extends object, S extends string = string> = T & {
  slug: S;
};
export type WithWorldId<T extends object> = T & { worldId: WorldId | string };
export type WithOptionalWorldId<T extends object> = T & {
  worldId?: WorldId | string;
};

export const withId = <T extends object, ID extends string = string>(
  obj: T,
  id: ID
): WithId<T, ID> => ({
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

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
// @see https://stackoverflow.com/questions/49595193/generating-random-key-firestore
// @see https://github.com/firebase/firebase-js-sdk/blob/73a586c92afe3f39a844b2be86086fddb6877bb7/packages/firestore/src/util/misc.ts#L36
export const generateFirestoreId: (options?: {
  emulated: boolean;
}) => string = (options) => {
  if (!options?.emulated) {
    return firebase.firestore().collection("tmp").doc().id;
  }

  let id = "";
  for (let i = 0; i < 20; i++) {
    id += CHARS.charAt(Math.floor(Math.random() * CHARS.length));
  }
  return id;
};

type ConvertToFirestoreKey = (key: unknown) => string;
export const convertToFirestoreKey: ConvertToFirestoreKey = (key) =>
  String(key ?? "").trim() || "INVALID-FIRESTORE-KEY-" + key;
