import { useMemo } from "react";
import { useAsync } from "react-use";
import { useFirestore } from "reactfire";
import { QueryConstraint } from "@firebase/firestore";
import { collection, getDocs, query } from "firebase/firestore";

import { withIdConverter } from "utils/converters";

type UseFireCollectionOptions =
  | string[]
  | {
      path: string[];
      constraints?: QueryConstraint[];
    };

export const useFireCollection = <T extends object>(
  options: UseFireCollectionOptions
) => {
  const firestore = useFirestore();

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
          ...constraints
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
