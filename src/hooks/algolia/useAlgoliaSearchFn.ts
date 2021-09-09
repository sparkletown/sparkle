import { useAsyncFn } from "react-use";

import { algoliaSearchIndexes, AlgoliaSearchResult } from "types/algolia";

import { useAlgoliaSearchContext } from "hooks/algolia/context";

export const useAlgoliaSearchFn = () => {
  const context = useAlgoliaSearchContext();

  return useAsyncFn(
    async (query: string) => {
      if (context?.client) {
        const indexes = algoliaSearchIndexes;
        const { results } = await context.client.search(
          indexes.map((indexName) => ({
            indexName,
            query,
          }))
        );
        return Object.assign(
          {},
          ...indexes.map((indexName, i) => ({ [indexName]: results[i] }))
        ) as AlgoliaSearchResult;
      } else return undefined;
    },
    [context?.client]
  );
};
