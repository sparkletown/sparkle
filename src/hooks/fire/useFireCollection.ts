import { useMemo } from "react";
import { useAsync } from "react-use";
import { collection, getDocs, getFirestore, query } from "firebase/firestore";

import { ALWAYS_EMPTY_ARRAY } from "settings";

import { withIdConverter } from "utils/converters";
import {
  CollectionQueryOptions,
  createConstraintsError,
  createPathError,
  parseCollectionQueryOptions,
} from "utils/query";

export const useFireCollection = <T extends object, ID extends string = string>(
  options: CollectionQueryOptions
) => {
  const {
    path,
    first,
    rest,
    hasPathError,
    hasConstraintsError,
    hasDeferred,
    constraints,
    filteredConstraints,
  } = parseCollectionQueryOptions(options);

  const { error: fireError, loading, value } = useAsync(async () => {
    // construction of the query is where the Firestore SDK may break if invalid values are given
    if (hasPathError || hasConstraintsError || hasDeferred) return;

    return (
      await getDocs(
        query(
          collection(getFirestore(), first, ...rest),
          ...filteredConstraints
        ).withConverter(withIdConverter<T, ID>())
      )
    )?.docs?.map((d) => d.data());
  }, [
    first,
    rest,
    filteredConstraints,
    hasPathError,
    hasConstraintsError,
    hasDeferred,
  ]);

  const error = hasPathError
    ? createPathError(path)
    : hasConstraintsError
    ? createConstraintsError(constraints)
    : fireError;

  return useMemo(() => {
    return {
      error,
      data: value ?? ALWAYS_EMPTY_ARRAY,
      isLoading: loading,
      isLoaded: !loading,
    };
  }, [error, loading, value]);
};
