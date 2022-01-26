import firebase from "firebase/app";

import { World } from "api/world";

import { DistributedCounterValue } from "types/Firestore";

import { WithId, withId } from "utils/id";

const withIdConverterObj: firebase.firestore.FirestoreDataConverter<object> = {
  toFirestore: (value: object): firebase.firestore.DocumentData => value,

  fromFirestore: (snapshot: firebase.firestore.QueryDocumentSnapshot) =>
    withId(snapshot.data(), snapshot.id),
};

export const withIdConverter = <T extends object>() =>
  withIdConverterObj as firebase.firestore.FirestoreDataConverter<WithId<T>>;

export const distributedCounterValueConverter: firebase.firestore.FirestoreDataConverter<DistributedCounterValue> =
  {
    fromFirestore: (
      snapshot: firebase.firestore.QueryDocumentSnapshot
    ): DistributedCounterValue => ({ value: snapshot.data().value }),

    toFirestore: ({
      value,
    }: DistributedCounterValue): firebase.firestore.DocumentData => ({
      value,
    }),
  };

export const worldConverter: firebase.firestore.FirestoreDataConverter<
  WithId<World>
> = {
  toFirestore: (world: WithId<World>): firebase.firestore.DocumentData => world,

  fromFirestore: (
    snapshot: firebase.firestore.QueryDocumentSnapshot
  ): WithId<World> => withId(snapshot.data() as World, snapshot.id),
};
