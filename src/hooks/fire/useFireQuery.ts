import { useMemo } from "react";
import { useAsync } from "react-use";
import { getDocs, Query } from "firebase/firestore";

import { DeferredAction } from "types/id";

import { dataWithId, isDeferred } from "utils/query";

export const useFireQuery = <T extends object>(
  query: Query<T> | DeferredAction
) => {
  const hasDeferred = isDeferred(query);

  const { error: fireError, loading, value } = useAsync(
    async () =>
      hasDeferred ? undefined : (await getDocs(query)).docs.map(dataWithId),
    [query, hasDeferred]
  );

  return useMemo(
    () => ({
      error: fireError,
      data: value,
      isLoading: loading,
      isLoaded: !loading,
    }),
    [fireError, loading, value]
  );
};
