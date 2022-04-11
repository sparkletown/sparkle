import { useCallback, useMemo, useState } from "react";
import { where } from "firebase/firestore";
import Fuse from "fuse.js";

import {
  COLLECTION_SPACES,
  DEFAULT_DISPLAYED_POSTER_PREVIEW_COUNT,
} from "settings";

import { PosterPageSpaceWithId } from "types/id";
import { VenueTemplate } from "types/VenueTemplate";

import { tokeniseStringWithQuotesBySpaces } from "utils/text";

import { useRefiCollection } from "hooks/fire/useRefiCollection";

import { useDebounceSearch } from "./useDebounceSearch";

export const usePosterVenues = (posterHallId: string) => {
  const { data, isLoaded } = useRefiCollection<PosterPageSpaceWithId>({
    path: [COLLECTION_SPACES],
    constraints: [
      where("template", "==", VenueTemplate.posterpage),
      where("parentId", "==", posterHallId),
    ],
  });
  return useMemo(
    () => ({
      posterVenues: data ?? [],
      isPostersLoaded: isLoaded,
    }),
    [data, isLoaded]
  );
};

export const usePosters = (posterHallId: string) => {
  const { posterVenues, isPostersLoaded } = usePosterVenues(posterHallId);

  const {
    searchInputValue,
    searchQuery,
    setSearchInputValue,
  } = useDebounceSearch();

  const [displayedPostersCount, setDisplayedPostersAmount] = useState(
    DEFAULT_DISPLAYED_POSTER_PREVIEW_COUNT
  );

  const increaseDisplayedPosterCount = useCallback(() => {
    setDisplayedPostersAmount(
      (prevPostersNumber) =>
        prevPostersNumber + DEFAULT_DISPLAYED_POSTER_PREVIEW_COUNT
    );
  }, []);

  // See https://fusejs.io/api/options.html
  const fuseVenues = useMemo(
    () =>
      new Fuse(posterVenues, {
        keys: [
          "name",
          "poster.title",
          "poster.authorName",
          "poster.categories",
          "poster.authors",
          "poster.keywords",
          "poster.introduction",
        ],
        threshold: 0.2, // 0.1 seems to be exact, default 0.6: brings too distant if anyhow related hits
        ignoreLocation: true, // default False: True - to search ignoring location of the words.
        findAllMatches: true,
      }),
    [posterVenues]
  );

  const searchedPosterVenues = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim();

    if (!normalizedSearchQuery) return posterVenues;

    const tokenisedSearchQuery = tokeniseStringWithQuotesBySpaces(
      normalizedSearchQuery
    );

    if (tokenisedSearchQuery.length === 0) return posterVenues;

    return fuseVenues
      .search({
        $and: tokenisedSearchQuery.map((searchToken: string) => {
          const orFields: Fuse.Expression[] = [
            { name: searchToken },
            { "poster.title": searchToken },
            { "poster.authorName": searchToken },
            { "poster.categories": searchToken },
            { "poster.authors": searchToken },
            { "poster.keywords": searchToken },
            { "poster.introduction": searchToken },
          ];

          return {
            $or: orFields,
          };
        }),
      })
      .map((fuseResult) => fuseResult.item);
  }, [searchQuery, fuseVenues, posterVenues]);

  const displayedPosterVenues = useMemo(
    () => searchedPosterVenues.slice(0, displayedPostersCount),
    [searchedPosterVenues, displayedPostersCount]
  );

  const hasHiddenPosters =
    searchedPosterVenues.length > displayedPosterVenues.length;

  return {
    posterVenues: displayedPosterVenues,
    isPostersLoaded,
    hasHiddenPosters,

    searchInputValue,

    increaseDisplayedPosterCount,
    setSearchInputValue,
  };
};
