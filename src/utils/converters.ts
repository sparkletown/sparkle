import { FirestoreDataConverter as ModularFirestoreDataConverter } from "firebase/firestore";

import { World } from "api/world";

import {
  DistributedCounterValue,
  InterimDocumentData,
  InterimQueryDocumentSnapshot,
  InterimSnapshotOptions,
} from "types/Firestore";

import { WithId, withId } from "utils/id";

export const CONVERTER_DISTRIBUTED_COUNTER_VALUE: ModularFirestoreDataConverter<DistributedCounterValue> = {
  fromFirestore: (
    snapshot: InterimQueryDocumentSnapshot<InterimDocumentData>
  ): DistributedCounterValue => ({ value: snapshot.data().value }),
  toFirestore: ({ value }: DistributedCounterValue): InterimDocumentData => ({
    value,
  }),
};
Object.freeze(CONVERTER_DISTRIBUTED_COUNTER_VALUE);

// @debt can be replaced with a call to withIdConverter() (or the function can be deprecated)
export const CONVERTER_WORLD_WITH_ID: ModularFirestoreDataConverter<
  WithId<World>
> = {
  toFirestore: (world: WithId<World>): InterimDocumentData => world,
  fromFirestore: (
    snapshot: InterimQueryDocumentSnapshot<InterimDocumentData>
  ): WithId<World> => withId(snapshot.data() as World, snapshot.id),
};
Object.freeze(CONVERTER_WORLD_WITH_ID);

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
