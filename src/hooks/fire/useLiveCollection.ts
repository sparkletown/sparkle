import { useEffect, useMemo, useState } from "react";
import { QueryConstraint } from "@firebase/firestore";
import {
  collection,
  FirestoreError,
  getFirestore,
  onSnapshot,
  query,
  QueryDocumentSnapshot,
  QuerySnapshot,
} from "firebase/firestore";
import { isEqual } from "lodash";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { withIdConverter } from "utils/converters";
import { withId } from "utils/id";

type UseLiveCollectionOptions =
  | string[]
  | {
      path: string[];
      constraints?: (QueryConstraint | null | undefined)[];
    };

const toDataWithId = <T extends object>(d: QueryDocumentSnapshot<T>) =>
  withId(d.data(), d.id);

const isValidSegment = (segment: string | undefined): segment is string =>
  "string" === typeof segment && "" !== segment;

const isValidConstraint = (
  constraint: QueryConstraint | null | undefined
): constraint is QueryConstraint =>
  constraint !== null && constraint !== undefined;

export const useLiveCollection = <T extends object>(
  options: UseLiveCollectionOptions
) => {
  const [data, setData] = useState<T[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const path = Array.isArray(options) ? options : options?.path;
  const constraints = Array.isArray(options) ? undefined : options?.constraints;

  const memoizedPath = useMemo(
    () => (path ?? ALWAYS_EMPTY_ARRAY).filter(isValidSegment),
    [path]
  );

  const memoizedConstraints = useMemo(
    () => (constraints ?? ALWAYS_EMPTY_ARRAY).filter(isValidConstraint),
    [constraints]
  );

  const memoizedQuery = useMemo(() => {
    const [first, ...rest] = memoizedPath;
    // Firestore API requires at least two good segments for it to work
    if (!rest?.length && !memoizedConstraints.length) return;

    return query(
      collection(getFirestore(), first, ...rest),
      ...memoizedConstraints
    ).withConverter(withIdConverter<T>());
  }, [memoizedPath, memoizedConstraints]);

  useEffect(() => {
    // prevents warning: Can't perform a React state update on an unmounted component.
    let isMounted = true;

    if (!memoizedQuery) return;

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

    const unsubscribe = onSnapshot<T>(memoizedQuery, onNext, onError);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [memoizedQuery, setData, setError, setIsLoading]);

  return useMemo(() => ({ error, data, isLoading, isLoaded: !isLoading }), [
    error,
    isLoading,
    data,
  ]);
};
