import firebase from "firebase/app";

import { DistributedCounterValue } from "types/Firestore";

import { WithId, withId } from "utils/id";

const withIdConverterObj: firebase.firestore.FirestoreDataConverter<object> = {
  toFirestore: (value: object): firebase.firestore.DocumentData => value,

  fromFirestore: (snapshot: firebase.firestore.QueryDocumentSnapshot) =>
    withId(snapshot.data(), snapshot.id),
};

export const withIdConverter = <T extends object>() =>
  withIdConverterObj as firebase.firestore.FirestoreDataConverter<WithId<T>>;

export const distributedCounterValueConverter: firebase.firestore.FirestoreDataConverter<DistributedCounterValue> = {
  fromFirestore: (
    snapshot: firebase.firestore.QueryDocumentSnapshot
  ): DistributedCounterValue => ({ sum: snapshot.data().sum }),

  toFirestore: ({
    sum,
  }: DistributedCounterValue): firebase.firestore.DocumentData => ({
    sum,
  }),
};
