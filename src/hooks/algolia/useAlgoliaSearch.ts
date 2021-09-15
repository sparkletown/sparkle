import { useEffect } from "react";
import { useAsync } from "react-use";

import { algoliaSearchIndexes, AlgoliaSearchResult } from "types/algolia";
import { UserWithLocation } from "types/User";

import { propName } from "utils/propName";

import { useAlgoliaSearchContext } from "hooks/algolia/context";

export const useAlgoliaSearch = (
  venueId: string | undefined,
  searchQuery: string | undefined
) => {
  const context = useAlgoliaSearchContext();

  const state = useAsync(async (): Promise<AlgoliaSearchResult | undefined> => {
    if (!context?.client || !venueId || !searchQuery) return undefined;

    const indexes = algoliaSearchIndexes;
    const { results } = await context.client.search(
      indexes.map((indexName) => ({
        indexName,
        query: searchQuery,
        params: {
          filters: `${propName<UserWithLocation>(
            "enteredVenueIds"
          )}: ${venueId}`,
        },
      }))
    );

    return Object.assign(
      {},
      ...indexes.map((indexName, i) => ({ [indexName]: results[i] }))
    );
  }, [context?.client, searchQuery, venueId]);

  useEffect(() => {
    if (state.error) {
      console.warn("useAlgoliaSearch::error ", state.error);
    }
  }, [state.error]);

  return state;
};
