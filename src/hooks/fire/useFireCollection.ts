import { useMemo } from "react";
import { useAsync } from "react-use";
import { QueryConstraint } from "@firebase/firestore";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";

import { withIdConverter } from "utils/converters";

type UseFireCollectionOptions =
  | string[]
  | {
      path: string[];
      constraints?: (QueryConstraint | null | undefined)[];
    };

export const useFireCollection = <T extends object>(
  options: UseFireCollectionOptions
) => {
  const firestore = getFirestore();

  const path = useMemo(
    () => (Array.isArray(options) ? options : options?.path) ?? [],
    [options]
  );
  const constraints = useMemo(
    () => (Array.isArray(options) ? [] : options?.constraints) ?? [],
    [options]
  );

  const { error, loading, value } = useAsync(async () => {
    if (!path?.length || path.some((segment) => !segment)) return;

    if (
      constraints?.length &&
      constraints.some((segment) => segment === null || segment === undefined)
    )
      return;

    const [first, ...rest] = path;

    return (
      await getDocs(
        query(
          collection(firestore, first, ...rest),
          // the check above weeds out falsy values, but isn't a type guard, so TS complains
          ...(constraints as QueryConstraint[])
        ).withConverter(withIdConverter<T>())
      )
    )?.docs?.map((d) => d.data());
  }, [firestore, path, constraints]);

  return useMemo(() => {
    return {
      error,
      data: value ?? [],
      isLoading: loading,
      isLoaded: !loading,
    };
  }, [error, loading, value]);
};
