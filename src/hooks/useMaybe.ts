import {
  useFirestoreCollectionData,
  useFirestoreDocData,
  useObservable,
} from "reactfire";
import { DocumentReference, Query } from "firebase/firestore";
import { Observable } from "rxjs";

export const useMaybeFirestoreDocData = <T>(query?: DocumentReference<T>) => {
  if (!query) {
    const observable = new Observable<T>((subscriber) => {});
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useObservable<T>("dummyObservable", observable);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useFirestoreDocData(query);
  }
};
export const useMaybeFirestoreCollectionData = <T>(query?: Query<T>) => {
  if (!query) {
    const observable = new Observable<T[]>((subscriber) => {});
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useObservable<T[]>("dummyObservable", observable);
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    return useFirestoreCollectionData(query);
  }
};
