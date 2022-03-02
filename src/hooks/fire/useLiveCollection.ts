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

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { FireConstraint } from "types/fire";
import { DeferredAction } from "types/id";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";
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
  | DeferredAction
  | string[]
  | {
      path: string[] | DeferredAction;
      constraints?: FireConstraint[] | DeferredAction;
    };

type OptionsToPath = (options: UseLiveCollectionOptions) => string[];
type OptionsToConstraints = (
  options: UseLiveCollectionOptions
) => FireConstraint[];
type CheckDeferred = (options: UseLiveCollectionOptions) => boolean | undefined;

const optionsToPath: OptionsToPath = (options) => {
  if (Array.isArray(options)) return options;
  if (isDeferred(options)) return ALWAYS_EMPTY_ARRAY;
  if (isDeferred(options.path)) return ALWAYS_EMPTY_ARRAY;
  return options.path ?? ALWAYS_EMPTY_ARRAY;
};

const optionsToConstraints: OptionsToConstraints = (options) => {
  if (Array.isArray(options)) return ALWAYS_EMPTY_ARRAY;
  if (isDeferred(options)) return ALWAYS_EMPTY_ARRAY;
  if (isDeferred(options.constraints)) return ALWAYS_EMPTY_ARRAY;
  return options.constraints ?? ALWAYS_EMPTY_ARRAY;
};

const checkDeferred: CheckDeferred = (options) => {
  if (isDeferred(options)) return true;
  if (Array.isArray(options)) return options?.some(isDeferred);

  const path = options.path;
  const constraints = options.constraints;
  if (isDeferred(path)) return true;
  if (isDeferred(constraints)) return true;

  return path?.some(isDeferred) || constraints?.some(isDeferred);
};

export const useLiveCollection = <T extends object, ID extends string = string>(
  options: UseLiveCollectionOptions
) => {
  const [data, setData] = useState<WithId<T, ID>[]>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const hasDeferred = checkDeferred(options);
  const path = optionsToPath(options);
  const constraints = optionsToConstraints(options);

  const filteredPath = path.filter(isGoodSegment);
  const filteredConstraints = constraints.filter(isGoodConstraint);

  // Some quality of life and input sanity checks follow, like
  // Firestore API requires at least two defined arguments for it to not throw an error

  const [first, ...rest] = filteredPath;
  const shortPath = !rest?.length;
  const incompletePath = !first;
  const noConstraints = !filteredConstraints.length;
  const invalidPath = path?.some(isNotValidSegment);
  const invalidConstraints = constraints?.some(isNotValidConstraint);

  const hasPathError = incompletePath || invalidPath;
  const hasConstraintsError =
    (shortPath && noConstraints) || invalidConstraints;

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
