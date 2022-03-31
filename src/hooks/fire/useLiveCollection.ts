import { useEffect, useMemo, useState } from "react";
import {
  collection,
  FirestoreError,
  getFirestore,
  onSnapshot,
  query,
  QuerySnapshot,
} from "firebase/firestore";
import { isEqual } from "lodash";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";
import {
  CollectionQueryOptions,
  createConstraintsError,
  createPathError,
  dataWithId,
  parseCollectionQueryOptions,
} from "utils/query";

export const useLiveCollection = <T extends object, ID extends string = string>(
  options: CollectionQueryOptions
) => {
  const [data, setData] = useState<WithId<T, ID>[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const {
    path,
    first,
    rest,
    hasPathError,
    hasConstraintsError,
    hasDeferred,
    constraints,
    filteredConstraints,
  } = useMemo(() => parseCollectionQueryOptions(options), [options]);

  // construction of the query is where the Firestore SDK may break if invalid values are given
  const memoizedQuery = useMemo(
    () =>
      hasPathError || hasConstraintsError || hasDeferred
        ? undefined
        : query(
            collection(getFirestore(), first, ...rest),
            ...filteredConstraints
          ).withConverter(withIdConverter<T, ID>()),
    [
      filteredConstraints,
      first,
      rest,
      hasPathError,
      hasConstraintsError,
      hasDeferred,
    ]
  );

  useEffect(() => {
    // prevents warning: Can't perform a React state update on an unmounted component.
    let isMounted = true;

    if (!memoizedQuery) {
      setIsLoading(false);
      return;
    }

    const onNext = (snap: QuerySnapshot<WithId<T, ID>>) => {
      if (!isMounted) return;
      setData((oldData) => {
        // this check prevents endless re-renders
        const maybeNewData = snap.docs.map(dataWithId);
        return isEqual(oldData, maybeNewData) ? oldData : maybeNewData;
      });
      setIsLoading(false);
    };

    const onError = (err: FirestoreError) => {
      if (!isMounted) return;
      setError(err);
      setIsLoading(false);
    };

    const unsubscribe = onSnapshot<WithId<T, ID>>(
      memoizedQuery,
      onNext,
      onError
    );

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [memoizedQuery, setData, setError, setIsLoading]);

  const result = useMemo(
    () => ({ error, data, isLoading, isLoaded: !isLoading }),
    [error, isLoading, data]
  );

  // don't emit errors when deferred, hook isn't listening anyway
  // also, if there's already an error, don't set another one, will just trigger re-render
  if (!hasDeferred && !error) {
    if (hasPathError) setError(createPathError(path));
    else if (hasConstraintsError) setError(createConstraintsError(constraints));
  }

  return result;
};
