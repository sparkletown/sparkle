import { useEffect, useMemo, useState } from "react";
import {
  FirestoreError,
  onSnapshot,
  Query,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { isEqual } from "lodash";

import { withId } from "utils/id";

const toDataWithId = <T extends object>(d: QueryDocumentSnapshot<T>) =>
  withId(d.data(), d.id);

export const useLiveQuery = <T extends object>(query: Query<T>) => {
  const [data, setData] = useState<T[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  useEffect(() => {
    // prevents warning: Can't perform a React state update on an unmounted component.
    let isMounted = true;

    const onNext = (snap: QuerySnapshot<T>) => {
      if (!isMounted) return;
      setData((oldData) => {
        // this check prevents endless re-renders
        const maybeNewData = snap.docs.map(toDataWithId);
        return isEqual(oldData, maybeNewData) ? oldData : maybeNewData;
      });
      setIsLoading(false);
    };

    const onError = (err: FirestoreError) => {
      if (!isMounted) return;
      setError(err);
      setIsLoading(false);
    };

    const unsubscribe = onSnapshot<T>(query, onNext, onError);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [query, setData, setError, setIsLoading]);

  return useMemo(() => ({ error, data, isLoading, isLoaded: !isLoading }), [
    error,
    isLoading,
    data,
  ]);
};
