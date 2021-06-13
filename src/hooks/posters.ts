import { useState, useMemo, useCallback, useEffect } from "react";

import Fuse from "fuse.js";

import { VenueEvent, VenueTemplate } from "types/venues";

import { tokeniseStringWithQuotesBySpaces } from "utils/text";
import { posterVenuesSelector } from "utils/selectors";
import { isEventLive } from "utils/event";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";
import { useDebounceSearch } from "./useDebounceSearch";
import { useRelatedVenues } from "./useRelatedVenues";
import { useVenueEvents } from "./events";
import { useInterval } from "./useInterval";

import { POSTERHALL_SUBVENUE_STATUS_MS } from "settings";
import { WithVenueId } from "utils/id";

import { DEFAULT_DISPLAYED_POSTER_PREVIEW_COUNT } from "settings";

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

  // See https://fusejs.io/api/options.html
  const fuseVenues = useMemo(
    () =>
      new Fuse(filteredPosterVenues, {
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
    [filteredPosterVenues]
  );

  const searchedPosterVenues = useMemo(() => {
    const normalizedSearchQuery = searchQuery.trim();

    if (!normalizedSearchQuery) return filteredPosterVenues;

    const tokenisedSearchQuery = tokeniseStringWithQuotesBySpaces(
      normalizedSearchQuery
    );

    if (tokenisedSearchQuery.length === 0) return filteredPosterVenues;

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

export const checkLiveEvents = (subVenueEvents: WithVenueId<VenueEvent>[]) => {
  return subVenueEvents.filter((event) => isEventLive(event));
};

export const usePosterHallSubVenues = (posterHallId: string) => {
  const { relatedVenues } = useRelatedVenues({
    currentVenueId: posterHallId,
  });

  const subVenueIds = useMemo(() => {
    return relatedVenues
      .filter(
        (relatedVenue) =>
          relatedVenue.parentId === posterHallId &&
          relatedVenue.template !== VenueTemplate.posterpage
      )
      .map((venue) => venue.id);
  }, [relatedVenues, posterHallId]);

  const { events: subVenueEvents } = useVenueEvents({
    venueIds: subVenueIds,
  });

  const [liveVenueEvents, setLiveVenueEvents] = useState(
    checkLiveEvents(subVenueEvents)
  );

  useEffect(() => setLiveVenueEvents(() => checkLiveEvents(subVenueEvents)), [
    subVenueEvents,
  ]);

  useInterval(() => {
    setLiveVenueEvents(() => checkLiveEvents(subVenueEvents));
  }, POSTERHALL_SUBVENUE_STATUS_MS);

  return {
    liveVenueEvents,
  };
};
