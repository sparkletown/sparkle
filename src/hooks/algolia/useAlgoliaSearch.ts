import { useEffect } from "react";
import { useAsync } from "react-use";
import { keyBy } from "lodash";

import { AlgoliaSearchResult } from "types/algolia";
import { WorldId } from "types/id";
import { UserWithLocation } from "types/User";

import { propName } from "utils/propName";
import { isBlank } from "utils/string";

import { useAlgoliaSearchContext } from "hooks/algolia/context";

export const useAlgoliaSearch = (
  searchQuery: string | undefined,
  params?: {
    worldId: WorldId;
  }
) => {
  const context = useAlgoliaSearchContext();

  const { worldId } = params ?? {};

  const state = useAsync(async () => {
    if (
      !context?.client ||
      !context?.indices ||
      !searchQuery ||
      isBlank(searchQuery)
    )
      return;
    const { results } = await context.client.search(
      Object.values(context.indices).map((index) => ({
        indexName: index.indexName,
        query: searchQuery,
        ...(worldId && {
          params: {
            filters: `${propName<UserWithLocation>(
              "enteredWorldIds"
            )}: ${worldId}`,
          },
        }),
      }))
    );

    return keyBy(results, "index") as AlgoliaSearchResult;
  }, [context?.client, context?.indices, searchQuery, worldId]);

  useEffect(() => {
    if (state.error) {
      console.warn("useAlgoliaSearch::error ", state.error);
    }
  }, [state.error]);

  return state;
};
