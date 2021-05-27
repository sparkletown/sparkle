import { useState, useMemo, useCallback } from "react";
import { VenueTemplate } from "types/venues";
import Fuse from "fuse.js";

import { DEFAULT_DISPLAYED_POSTER_PREVIEW_COUNT } from "settings";

import { posterVenuesSelector } from "utils/selectors";
import { breakStringWithQuotesBySpaces } from "utils/text";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";
import { useDebounceSearch } from "./useDebounceSearch";

export const useConnectPosterVenues = (posterHallId: string) => {
  useFirestoreConnect(() => {
    return [
      {
        collection: "venues",
        where: [
          ["template", "==", VenueTemplate.posterpage],
          ["parentId", "==", posterHallId],
        ],
        storeAs: "posterVenues",
      },
    ];
  });
};

export const usePosterVenues = (posterHallId: string) => {
  useConnectPosterVenues(posterHallId);

  const posterVenues = useSelector(posterVenuesSelector);

  return useMemo(
    () => ({
      posterVenues: posterVenues ?? [],
      isPostersLoaded: isLoaded(posterVenues),
    }),
    [posterVenues]
  );
};

export const usePosters = (posterHallId: string) => {
  const { posterVenues, isPostersLoaded } = usePosterVenues(posterHallId);

  const {
    searchInputValue,
    searchQuery,
    setSearchInputValue,
  } = useDebounceSearch();

  const [liveFilter, setLiveFilter] = useState<boolean>(false);
  const [displayedPostersCount, setDisplayedPostersAmount] = useState(
    DEFAULT_DISPLAYED_POSTER_PREVIEW_COUNT
  );

  const increaseDisplayedPosterCount = useCallback(() => {
    setDisplayedPostersAmount(
      (prevPostersNumber) =>
        prevPostersNumber + DEFAULT_DISPLAYED_POSTER_PREVIEW_COUNT
    );
  }, []);

  const filteredPosterVenues = useMemo(
    () =>
      liveFilter
        ? posterVenues.filter((posterVenue) => posterVenue.isLive)
        : posterVenues,
    [posterVenues, liveFilter]
  );

  const fuseVenues = useMemo(
    () =>
      new Fuse(filteredPosterVenues, {
        keys: [
          "name",
          "poster.title",
          "poster.authorName",
          "poster.categories",
        ],
        threshold: 0.2, // 0.1 seems to be exact, default 0.6: brings too distant if anyhow related hits
        ignoreLocation: true, // default False: True - to search ignoring location of the words.
        findAllMatches: true,
      }),
    [filteredPosterVenues]
  );

  const searchedPosterVenues = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim();

    if (!normalizedSearchQuery) return filteredPosterVenues;

    const matchEntries = breakStringWithQuotesBySpaces(normalizedSearchQuery);

    if (!matchEntries) return filteredPosterVenues;

    return fuseVenues
      .search({
        $and: matchEntries.map((x) => ({
          $or: [
            { name: x },
            { "poster.title": x },
            { "poster.authorName": x },
            { "poster.categories": x },
            // @debt Rewrite the search query to match the $and type
          ] as Record<string, string>[],
        })),
      })
      .map((fuseSearchItem) => fuseSearchItem.item);
  }, [searchQuery, fuseVenues, filteredPosterVenues]);

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
    liveFilter,

    increaseDisplayedPosterCount,
    setSearchInputValue,
    setLiveFilter,
  };
};
