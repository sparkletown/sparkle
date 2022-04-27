import firebase from "firebase/compat/app";
import {
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
} from "firebase/firestore";

export type CompatDocumentData = firebase.firestore.DocumentData;
export type InterimDocumentData = CompatDocumentData | DocumentData;

export type CompatQueryDocumentSnapshot<
  T
> = firebase.firestore.QueryDocumentSnapshot<T>;
export type InterimQueryDocumentSnapshot<T> =
  | CompatQueryDocumentSnapshot<T>
  | QueryDocumentSnapshot<T>;

export type CompatCreated = firebase.firestore.SnapshotOptions;
export type InterimSnapshotOptions = CompatCreated | SnapshotOptions;
