import { SearchResponse } from "@algolia/client-search";

import { BaseUser } from "types/User";

export enum AlgoliaSearchIndex {
  USERS = "algolia-users",
}

export const algoliaSearchIndexes: AlgoliaSearchIndex[] = Object.values(
  AlgoliaSearchIndex
);

export type AlgoliaUsersSearchResult = SearchResponse<
  Pick<BaseUser, "partyName" | "pictureUrl" | "anonMode">
>;

export type AlgoliaSearchResult = Record<
  AlgoliaSearchIndex,
  AlgoliaUsersSearchResult
>;
