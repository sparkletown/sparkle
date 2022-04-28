import { FirestoreDataConverter as ModularFirestoreDataConverter } from "firebase/firestore";
import { omit, pick } from "lodash";

import {
  InterimDocumentData,
  InterimQueryDocumentSnapshot,
  InterimSnapshotOptions,
} from "../AnimateMapFirestore";
import { WithId, withId } from "../AnimateMapIds";
import { UserWithLocation } from "../AnimateMapUser";

export type Branded<K, T extends string> = K & { __brand: T };

const CONVERTER_WITH_ID = {
  toFirestore: <T = unknown>(value: T) => value as InterimDocumentData,
  fromFirestore: (
    snapshot: InterimQueryDocumentSnapshot<InterimDocumentData>,
    options?: InterimSnapshotOptions
  ) => withId(snapshot.data(), snapshot.id),
};
Object.freeze(CONVERTER_WITH_ID);

export const withIdConverter = <
  T extends object,
  ID extends string = string
>() => CONVERTER_WITH_ID as ModularFirestoreDataConverter<WithId<T, ID>>;

export const omitLocationFromUser = <T extends UserWithLocation>(user: T) =>
  omit(
    user,
    "lastVenueIdSeenIn",
    "lastSeenAt",
    "enteredVenueIds",
    "enteredWorldIds"
  );

export const extractLocationFromUser = <T extends UserWithLocation>(user: T) =>
  pick(
    user,
    "lastVenueIdSeenIn",
    "lastSeenAt",
    "enteredVenueIds",
    "enteredWorldIds"
  );

export const externalUrlAdditionalProps = {
  target: "_blank",
  rel: "noopener noreferrer",
};
Object.freeze(externalUrlAdditionalProps);

export const getExtraLinkProps = (isExternal: boolean) =>
  isExternal ? externalUrlAdditionalProps : {};

export const isDefined = <T>(
  value: T | null | undefined
): value is NonNullable<T> => value !== null && value !== undefined;
