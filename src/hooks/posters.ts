import { useState, useMemo } from "react";
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

  return useMemo(
    () => ({
      posterVenues: posterVenues ?? [],
      isPostersLoaded: isLoaded(posterVenues),
    }),
    [posterVenues]
  );
};

export const usePosters = (posterHallId: string) => {
  const { posterVenues } = usePosterVenues(posterHallId);

  const {
    searchInputValue,
    searchQuery,
    setSearchInputValue,
  } = useDebounceSearch();

  const [liveFilter, setLiveFilter] = useState<boolean>(false);

  const fuseVenues = useMemo(
    () =>
      new Fuse(posterVenues, {
        keys: ["poster.title", "poster.authorName", "poster.categories"],
      }),
    [posterVenues]
  );

  const searchedPosterVenues = useMemo(() => {
    if (!searchQuery) return posterVenues;

    return fuseVenues
      .search(searchQuery)
      .map((fuseSearchItem) => fuseSearchItem.item);
  }, [searchQuery, fuseVenues, posterVenues]);

  const filteredPosterVenues = useMemo(
    () =>
      liveFilter
        ? searchedPosterVenues.filter((posterVenue) => posterVenue.isLive)
        : searchedPosterVenues,
    [searchedPosterVenues, liveFilter]
  );

  return {
    posterVenues: filteredPosterVenues,

    searchInputValue,
    liveFilter,

    setSearchInputValue,
    setLiveFilter,
  };
};
