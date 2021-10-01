import firebase from "firebase/app";

import { WithId, withId } from "utils/id";

const withIdConverterObj: firebase.firestore.FirestoreDataConverter<object> = {
  toFirestore: (value: object): firebase.firestore.DocumentData => value,

  fromFirestore: (snapshot: firebase.firestore.QueryDocumentSnapshot) =>
    withId(snapshot.data(), snapshot.id),
};

export const withIdConverter = <T extends object>() =>
  withIdConverterObj as firebase.firestore.FirestoreDataConverter<WithId<T>>;
