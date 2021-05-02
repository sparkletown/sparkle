import { useState, useMemo, useEffect } from "react";
import { VenueTemplate } from "types/venues";
import Fuse from "fuse.js";

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

  return {
    posterVenues: posterVenues ?? [],
    isPostersLoaded: isLoaded(posterVenues),
  };
};

export const usePosters = (posterHallId: string) => {
  const { posterVenues } = usePosterVenues(posterHallId);

  const {
    searchInputValue,
    searchQuery,
    setSearchInputValue,
  } = useDebounceSearch();

  useEffect(() => {});

  const [liveFilter, setLiveFilter] = useState<boolean>(false);

  const hasFilters = searchQuery || liveFilter;

  const searchResultPosterVenues = useMemo(() => {
    const searchedPosterVenues = (() => {
      if (!searchQuery) return posterVenues;

      return new Fuse(posterVenues, {
        keys: ["poster.title", "poster.authorName", "poster.categories"],
      })
        .search(searchQuery)
        .map((fuseSeachItem) => fuseSeachItem.item);
    })();

    if (liveFilter)
      return searchedPosterVenues.filter((posterVenue) => posterVenue.isLive);

    return searchedPosterVenues;
  }, [posterVenues, searchQuery, liveFilter]);

  return {
    posterVenues: hasFilters ? searchResultPosterVenues : posterVenues,

    searchInputValue,
    liveFilter,

    setSearchInputValue,
    setLiveFilter,
  };
};
