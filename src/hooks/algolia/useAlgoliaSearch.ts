import { useEffect } from "react";
import { useAsync } from "react-use";
import { keyBy } from "lodash";

import { AlgoliaSearchResult } from "types/algolia";
import { UserWithLocation } from "types/User";

import { propName } from "utils/propName";
import { isBlank } from "utils/string";

import { useAlgoliaSearchContext } from "hooks/algolia/context";

export const useAlgoliaSearch = (
  venueId: string | undefined,
  searchQuery: string | undefined
) => {
  const context = useAlgoliaSearchContext();

  const state = useAsync(async () => {
    if (
      !context?.client ||
      !context?.indices ||
      !venueId ||
      !searchQuery ||
      isBlank(searchQuery)
    )
      return;

    const { results } = await context.client.search(
      Object.values(context.indices).map((index) => ({
        indexName: index.indexName,
        query: searchQuery,
        params: {
          filters: `${propName<UserWithLocation>(
            "enteredVenueIds"
          )}: ${venueId}`,
        },
      }))
    );

    return keyBy(results, "index") as AlgoliaSearchResult;
  }, [context?.client, context?.indices, searchQuery, venueId]);

  useEffect(() => {
    if (state.error) {
      console.warn("useAlgoliaSearch::error ", state.error);
    }
  }, [state.error]);

  return state;
};
