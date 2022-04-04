import { SearchResponse } from "@algolia/client-search";

import { UserWithLocation } from "types/User";

export enum AlgoliaSearchIndex {
  USERS = "algolia-users",
}

export type AlgoliaUsersSearchResult = SearchResponse<
  Pick<UserWithLocation, "partyName" | "pictureUrl" | "enteredVenueIds">
>;

export type AlgoliaSearchResult = Record<
  AlgoliaSearchIndex,
  AlgoliaUsersSearchResult
>;
