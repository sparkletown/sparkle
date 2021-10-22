import firebase from "firebase/app";

import { World } from "api/admin";

import { DistributedCounterValue } from "types/Firestore";
import { TalkShowSeatedUser } from "types/talkShow";

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
  ): DistributedCounterValue => ({ value: snapshot.data().value }),

  toFirestore: ({
    value,
  }: DistributedCounterValue): firebase.firestore.DocumentData => ({
    value,
  }),
};

export const talkShowSeatedUserConverter: firebase.firestore.FirestoreDataConverter<
  WithId<TalkShowSeatedUser>
> = {
  toFirestore: (
    venue: WithId<TalkShowSeatedUser>
  ): firebase.firestore.DocumentData => venue,

  fromFirestore: (
    snapshot: firebase.firestore.QueryDocumentSnapshot
  ): WithId<TalkShowSeatedUser> =>
    withId(snapshot.data() as TalkShowSeatedUser, snapshot.id),
};

export const worldConverter: firebase.firestore.FirestoreDataConverter<
  WithId<World>
> = {
  toFirestore: (world: WithId<World>): firebase.firestore.DocumentData => world,

  fromFirestore: (
    snapshot: firebase.firestore.QueryDocumentSnapshot
  ): WithId<World> => withId(snapshot.data() as World, snapshot.id),
};
