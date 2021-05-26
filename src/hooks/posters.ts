import { useState, useMemo, useCallback } from "react";
import { VenueTemplate } from "types/venues";
import Fuse from "fuse.js";

import { DEFAULT_DISPLAYED_POSTER_PREVIEW_COUNT } from "settings";

import { posterVenuesSelector } from "utils/selectors";

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
          {
            name: "poster.title",
            weight: 2,
          },
          {
            name: "poster.authorName",
            weight: 3,
          },
          {
            name: "poster.categories",
            weight: 1,
          },
        ],
        threshold: 0.2, // 0.1 seems to be exact, default 0.6: brings too distant if anyhow related hits
        ignoreLocation: true, // default False: True - to search ignoring location of the words.
        findAllMatches: true,
        minMatchCharLength: 3,
        // useExtendedSearch: true,  // might be neat but confusing. might be worthwhile a UI switch
      }),
    [filteredPosterVenues]
  );

  const searchedPosterVenues = useMemo(() => {
    if (!searchQuery)
      return filteredPosterVenues.slice(0, displayedPostersCount);

    return fuseVenues
      .search(searchQuery.trim()) // trim so adding space does not kill all results at once
      .slice(0, displayedPostersCount)
      .map((fuseSearchItem) => fuseSearchItem.item);
  }, [searchQuery, fuseVenues, filteredPosterVenues, displayedPostersCount]);

  return {
    posterVenues: searchedPosterVenues,
    isPostersLoaded,

    searchInputValue,
    liveFilter,

    increaseDisplayedPosterCount,
    setSearchInputValue,
    setLiveFilter,
  };
};
