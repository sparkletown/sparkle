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
        keys: ["poster.title", "poster.authorName", "poster.categories"],
        threshold: 0.2, // 0.1 seems to be exact, default 0.6: brings too distant if anyhow related hits
        ignoreLocation: true, // default False: True - to search ignoring location of the words.
        findAllMatches: true,
        // useExtendedSearch: true,  // might be neat but confusing. might be worthwhile a UI switch
      }),
    [filteredPosterVenues]
  );

  const searchedPosterVenues = useMemo(() => {
    if (!searchQuery)
      return filteredPosterVenues.slice(0, displayedPostersCount);

    return fuseVenues
      .search({
        //@ts-ignore
        $and: searchQuery
          .trim()
          .match(/("[^"]*?"|[^"\s]+)+(?=\s*|\s*$)/g) // source: https://stackoverflow.com/a/16261693/1265472 + fix
          .map((x) => ({
            $or: [
              { "poster.title": x },
              { "poster.authorName": x },
              { "poster.categories": x },
            ],
          })),
      })
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
