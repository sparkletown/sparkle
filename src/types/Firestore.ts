import firebase from "firebase/compat/app";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import { Reaction } from "types/reactions";
import { Table } from "types/Table";

// RE-EXPORT BEGIN

// type definitions to decrease declaration verbosity in other files
// also, during transition, to smooth out the compatability and the newer modular types

export type CompatCollectionReference<
  T
> = firebase.firestore.CollectionReference<T>;

export type CompatDocumentData = firebase.firestore.DocumentData;
export type InterimDocumentData = CompatDocumentData | DocumentData;

export type CompatFirestoreDataConverter<
  T
> = firebase.firestore.FirestoreDataConverter<T>;
export type InterimFirestoreDataConverter<T> =
  | CompatFirestoreDataConverter<T>
  | FirestoreDataConverter<T>;

export type CompatQueryDocumentSnapshot<
  T
> = firebase.firestore.QueryDocumentSnapshot<T>;
export type InterimQueryDocumentSnapshot<T> =
  | CompatQueryDocumentSnapshot<T>
  | QueryDocumentSnapshot<T>;

// RE-EXPORT END

export interface Experience {
  reactions: Record<string, Reaction>;
  tables: Record<string, Record<string, Table>>;
}

export interface UserVisit {
  timeSpent: number;
}

// note: these entries should be sorted alphabetically
export interface DistributedCounterValue {
  value: number;
}

export interface DistributedCounterShard {
  count: number;
}
