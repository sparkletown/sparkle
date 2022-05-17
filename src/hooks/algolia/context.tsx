import React, {
  createContext,
  PropsWithChildren,
  useContext,
  useMemo,
} from "react";
import algoliasearch, { SearchClient, SearchIndex } from "algoliasearch/lite";
import { ALGOLIA_API_SEARCH_KEY, ALGOLIA_APP_ID } from "env";
import { keyBy } from "lodash";

import { AlgoliaSearchIndex } from "types/algolia";

export interface AlgoliaSearchContextState {
  client: SearchClient;
  indices: Record<AlgoliaSearchIndex, SearchIndex>;
}

const initState = (appId: string, key: string): AlgoliaSearchContextState => {
  const client = algoliasearch(appId, key);
  const list = Object.values(
    AlgoliaSearchIndex
  ).map((indexName: AlgoliaSearchIndex) => client.initIndex(indexName));

  const indices = keyBy(list, "indexName") as Record<
    AlgoliaSearchIndex,
    SearchIndex
  >;

  return { client, indices };
};

const AlgoliaSearchContext = createContext<
  AlgoliaSearchContextState | undefined
>(undefined);

export const useAlgoliaSearchContext = ():
  | AlgoliaSearchContextState
  | undefined => useContext(AlgoliaSearchContext);

export const AlgoliaSearchProvider: React.FC<PropsWithChildren<unknown>> = ({
  children,
}) => {
  const state = useMemo(() => {
    if (!ALGOLIA_API_SEARCH_KEY) {
      console.warn(
        "Algolia API search key is missing! Search among users will not work."
      );

      return undefined;
    }

    if (!ALGOLIA_APP_ID) {
      console.warn(
        "Algolia Application id key is missing! Search among users will not work."
      );

      return undefined;
    }
    return initState(ALGOLIA_APP_ID, ALGOLIA_API_SEARCH_KEY);
  }, []);

  return (
    <>
      {state ? (
        <AlgoliaSearchContext.Provider value={state}>
          {children}
        </AlgoliaSearchContext.Provider>
      ) : (
        children
      )}
    </>
  );
};
