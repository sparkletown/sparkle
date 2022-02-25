import { useEffect, useMemo, useState } from "react";
import { QueryConstraint } from "@firebase/firestore";
import {
  collection,
  FirestoreError,
  getFirestore,
  onSnapshot,
  query,
  QuerySnapshot,
} from "firebase/firestore";
import { isEqual } from "lodash";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { DeferredAction } from "types/id";

import { withIdConverter } from "utils/converters";
import {
  createConstraintsError,
  createPathError,
  dataWithId,
  isDeferred,
  isGoodConstraint,
  isGoodSegment,
  isNotValidConstraint,
  isNotValidSegment,
} from "utils/query";

type UseLiveCollectionOptions =
  | string[]
  | {
      path: string[];
      constraints?: (QueryConstraint | DeferredAction | null | undefined)[];
    };

export const useLiveCollection = <T extends object>(
  options: UseLiveCollectionOptions
) => {
  const [data, setData] = useState<T[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const path = Array.isArray(options) ? options : options?.path;
  const constraints = Array.isArray(options) ? undefined : options?.constraints;

  const filteredPath = (path ?? ALWAYS_EMPTY_ARRAY).filter(isGoodSegment);
  const filteredConstraints = (constraints ?? ALWAYS_EMPTY_ARRAY).filter(
    isGoodConstraint
  );

  // Some quality of life and input sanity checks follow, like
  // Firestore API requires at least two defined arguments for it to not throw an error

  const [first, ...rest] = filteredPath;
  const shortPath = !rest?.length;
  const incompletePath = !first;
  const noConstraints = !filteredConstraints.length;
  const invalidPath = path?.some(isNotValidSegment);
  const invalidConstraints = constraints?.some(isNotValidConstraint);

  const hasDeferred = path?.some(isDeferred) || constraints?.some(isDeferred);

  const hasPathError = incompletePath || invalidPath;
  const hasConstraintsError =
    (shortPath && noConstraints) || invalidConstraints;

  if (hasPathError) setError(createPathError(path));
  if (hasConstraintsError) setError(createConstraintsError(constraints));

  // construction of the query is where the Firestore SDK may break if invalid values are given
  const memoizedQuery = useMemo(
    () =>
      hasPathError || hasConstraintsError || hasDeferred
        ? undefined
        : query(
            collection(getFirestore(), first, ...rest),
            ...filteredConstraints
          ).withConverter(withIdConverter<T>()),
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

    if (!memoizedQuery) return;

    const onNext = (snap: QuerySnapshot<T>) => {
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

    const unsubscribe = onSnapshot<T>(memoizedQuery, onNext, onError);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [
    memoizedQuery,
    setData,
    setError,
    setIsLoading,
    hasPathError,
    hasConstraintsError,
  ]);

  return useMemo(() => ({ error, data, isLoading, isLoaded: !isLoading }), [
    error,
    isLoading,
    data,
  ]);
};
