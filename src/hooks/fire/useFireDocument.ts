import { useMemo } from "react";
import { useAsync } from "react-use";
import { doc, getDoc, getFirestore } from "firebase/firestore";

import { FirePath } from "types/fire";
import { DeferredAction } from "types/id";

import { withIdConverter } from "utils/converters";
import { createPathError, isDeferred } from "utils/query";

export const useFireDocument = <T extends object, ID extends string = string>(
  path: FirePath | DeferredAction
) => {
  const hasDeferred = isDeferred(path) || path?.some(isDeferred);
  const hasError =
    !hasDeferred && (!path?.length || path.some((segment) => !segment));

  const { error: fireError, loading, value } = useAsync(async () => {
    if (hasDeferred || hasError) return;

    // the check above guards against bad values, but isn't a type guard, so TS complains
    const [first, ...rest] = path as string[];

    return (
      await getDoc(
        doc(getFirestore(), first, ...rest).withConverter(
          withIdConverter<T, ID>()
        )
      )
    )?.data();
  }, [path, hasError, hasDeferred]);

  const pathError = hasError ? createPathError(path) : undefined;

  return useMemo(
    () => ({
      error: pathError ?? fireError,
      data: value,
      isLoading: loading,
      isLoaded: !loading,
    }),
    [fireError, pathError, loading, value]
  );
};
