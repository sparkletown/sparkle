import { FirestoreDataConverter as ModularFirestoreDataConverter } from "firebase/firestore";

import {
  InterimDocumentData,
  InterimQueryDocumentSnapshot,
  InterimSnapshotOptions,
} from "types/Firestore";

import { WithId, withId } from "utils/id";

const CONVERTER_WITH_ID = {
  toFirestore: <T = unknown>(value: T) => value as InterimDocumentData,
  fromFirestore: (
    snapshot: InterimQueryDocumentSnapshot<InterimDocumentData>,
    options?: InterimSnapshotOptions
  ) => withId(snapshot.data(), snapshot.id),
};
Object.freeze(CONVERTER_WITH_ID);

const CONVERTER_IDENTITY = {
  toFirestore: <T = unknown>(value: T) => value as InterimDocumentData,
  fromFirestore: (
    snapshot: InterimQueryDocumentSnapshot<InterimDocumentData>,
    options?: InterimSnapshotOptions
  ) => withId(snapshot.data(), snapshot.id),
};
Object.freeze(CONVERTER_IDENTITY);

export const withIdConverter = <
  T extends object,
  ID extends string = string
>() => CONVERTER_WITH_ID as ModularFirestoreDataConverter<WithId<T, ID>>;

export const identityConverter = <T extends object>() =>
  CONVERTER_IDENTITY as ModularFirestoreDataConverter<T>;
