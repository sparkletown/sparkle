import { useState, useMemo, useCallback } from "react";
import { VenueTemplate } from "types/venues";
import Fuse from "fuse.js";

import { posterVenuesSelector } from "utils/selectors";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";
import { useDebounceSearch } from "./useDebounceSearch";

const POSTERS_PER_PAGE = 12;

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
  const [posterDisplayedNumber, setPosterDisplayedNumber] = useState(
    POSTERS_PER_PAGE
  );

  const increaseDisplayedPosters = useCallback(() => {
    setPosterDisplayedNumber(
      (prevPostersNumber) => prevPostersNumber + POSTERS_PER_PAGE
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
      }),
    [filteredPosterVenues]
  );

  const searchedPosterVenues = useMemo(() => {
    if (!searchQuery)
      return filteredPosterVenues.slice(0, posterDisplayedNumber);

    return fuseVenues
      .search(searchQuery)
      .slice(0, posterDisplayedNumber)
      .map((fuseSearchItem) => fuseSearchItem.item);
  }, [searchQuery, fuseVenues, filteredPosterVenues, posterDisplayedNumber]);

  return {
    posterVenues: searchedPosterVenues,
    isPostersLoaded,

    searchInputValue,
    liveFilter,

    increaseDisplayedPosters,
    setSearchInputValue,
    setLiveFilter,
  };
};
