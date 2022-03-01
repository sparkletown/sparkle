import { useEffect, useMemo, useState } from "react";
import {
  doc,
  DocumentSnapshot,
  FirestoreError,
  getFirestore,
  onSnapshot,
} from "firebase/firestore";
import { isEqual } from "lodash";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { FirePath } from "types/fire";
import { DeferredAction } from "types/id";

import { withIdConverter } from "utils/converters";
import { WithId } from "utils/id";
import {
  createPathError,
  isDeferred,
  isGoodSegment,
  isNotValidSegment,
} from "utils/query";

export const useLiveDocument = <T extends object>(
  path: FirePath | DeferredAction
) => {
  const [data, setData] = useState<WithId<T>>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();

  const hasDeferred = isDeferred(path) || path?.some(isDeferred);

  const filteredPath = hasDeferred
    ? ALWAYS_EMPTY_ARRAY
    : path.filter(isGoodSegment);

  // Some quality of life and input sanity checks follow, like
  // Firestore API requires at least two defined arguments for it to not throw an error

  const [first, ...rest] = filteredPath;
  const shortPath = !rest?.length;
  const incompletePath = !first;
  const invalidPath = !hasDeferred && path?.some(isNotValidSegment);

  const hasPathError = incompletePath || invalidPath;

  useEffect(() => {
    // prevents warning: Can't perform a React state update on an unmounted component.
    let isMounted = true;

    if (shortPath || hasPathError || hasDeferred) return;

    const reference = doc(getFirestore(), first, ...rest).withConverter(
      withIdConverter<T>()
    );

    const onNext = (doc: DocumentSnapshot<WithId<T>>) => {
      if (!isMounted) return;
      setData((oldData) => {
        // this check prevents endless re-renders
        const maybeNewData = doc.data();
        return isEqual(oldData, maybeNewData) ? oldData : maybeNewData;
      });
      setIsLoading(false);
    };

    const onError = (err: FirestoreError) => {
      if (!isMounted) return;
      setError(err);
      setIsLoading(false);
    };

    const unsubscribe = onSnapshot(reference, onNext, onError);

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [
    first,
    rest,
    shortPath,
    hasPathError,
    hasDeferred,
    setData,
    setError,
    setIsLoading,
  ]);

  const result = useMemo(
    () => ({ error, data, isLoading, isLoaded: !isLoading }),
    [error, isLoading, data]
  );

  // don't emit error when deferred, hook isn't listening anyway
  if (!hasDeferred && hasPathError) setError(createPathError(path));

  return result;
};
