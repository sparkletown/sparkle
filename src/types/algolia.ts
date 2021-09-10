import { SearchResponse } from "@algolia/client-search";

import { UserWithLocation } from "types/User";

export enum AlgoliaSearchIndex {
  USERS = "algolia-users",
}

export const algoliaSearchIndexes: AlgoliaSearchIndex[] = Object.values(
  AlgoliaSearchIndex
);

export type AlgoliaUsersSearchResult = SearchResponse<
  Pick<
    UserWithLocation,
    "partyName" | "pictureUrl" | "anonMode" | "enteredVenueIds"
  >
>;

export type AlgoliaSearchResult = Record<
  AlgoliaSearchIndex,
  AlgoliaUsersSearchResult
>;
