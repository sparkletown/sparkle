import { SearchResponse } from "@algolia/client-search";

import { User } from "types/User";

export enum AlgoliaSearchIndex {
  USERS = "algolia-users",
}

export const algoliaSearchIndexes: AlgoliaSearchIndex[] = Object.values(
  AlgoliaSearchIndex
);

export type AlgoliaUsersSearchResult = SearchResponse<Pick<User, "partyName">>;

export type AlgoliaSearchResult = Record<
  AlgoliaSearchIndex,
  AlgoliaUsersSearchResult
>;
