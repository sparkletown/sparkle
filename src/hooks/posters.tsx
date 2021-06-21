import React, {
  useState,
  useMemo,
  useCallback,
  useContext,
  createContext,
  useEffect,
} from "react";

import {
  DEFAULT_DISPLAYED_POSTER_PREVIEW_COUNT,
  POSTERHALL_SUBVENUE_STATUS_MS,
} from "settings";

import { VenueTemplate, PosterPageVenue, VenueEvent } from "types/venues";

import { isEventLive } from "utils/event";
import { WithVenueId, WithId } from "utils/id";
import { tokeniseStringWithQuotesBySpaces } from "utils/text";
import { posterVenuesSelector } from "utils/selectors";

import Fuse from "fuse.js";
import { shuffle } from "lodash";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";
import { useDebounceSearch } from "./useDebounceSearch";
import { useRelatedVenues } from "./useRelatedVenues";
import { useVenueEvents } from "./events";
import { useInterval } from "./useInterval";
import { useUser } from "./useUser";

export const emptySavedPosters = {};

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

export interface PostersContextState {
  posterVenues: WithId<PosterPageVenue>[];
  isPostersLoaded: boolean;
  hasHiddenPosters: boolean;
  searchInputValue: string;
  liveFilter: boolean;
  increaseDisplayedPosterCount: () => void;
  setSearchInputValue: (value: string) => void;
  setLiveFilter: (value: boolean) => void;
  bookmarkedFilter: boolean;
  setBookmarkedFilter: (value: boolean) => void;
}

export const PostersContext = createContext<PostersContextState | undefined>(
  undefined
);

export interface PostersProviderProps {
  venueId: string;
}

export const PostersProvider: React.FC<PostersProviderProps> = ({
  venueId,
  children,
}) => {
  const {
    searchInputValue,
    searchQuery,
    setSearchInputValue,
  } = useDebounceSearch();
  const { posterVenues: loadedPosterVenues, isPostersLoaded } = usePosterVenues(
    venueId
  );

  // newly loaded poster venues will get shuffled, but previous state takes priority
  const [previousPosterVenues, setPreviousPosterVenues] = useState<
    WithId<PosterPageVenue>[]
  >([]);
  const shuffledPosterVenues = useMemo(() => shuffle(loadedPosterVenues), [
    loadedPosterVenues,
  ]);

  const normalizedSearchQuery = searchQuery.trim();
  const tokenizedSearchQuery = tokeniseStringWithQuotesBySpaces(
    normalizedSearchQuery
  );
  const isEmptyQuery =
    !normalizedSearchQuery || tokenizedSearchQuery.length === 0;

  // for empty query, re-use the state, or in case it is empty, the shuffled that just got loaded
  const posterVenues = isEmptyQuery
    ? previousPosterVenues.length === 0
      ? shuffledPosterVenues
      : previousPosterVenues
    : loadedPosterVenues;

  useEffect(() => {
    // only save the shuffled poster venues state if the previous ones were empty
    // additional logic can be added to (re-/in-)validate based on time, userId or other parameters
    if (isEmptyQuery && isPostersLoaded && previousPosterVenues.length !== 0) {
      setPreviousPosterVenues(shuffledPosterVenues);
    }
  }, [
    isEmptyQuery,
    isPostersLoaded,
    shuffledPosterVenues,
    previousPosterVenues.length,
  ]);

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

  const liveFilteredPosterVenues = useMemo(
    () =>
      liveFilter
        ? posterVenues.filter((posterVenue) => posterVenue.isLive)
        : posterVenues,
    [posterVenues, liveFilter]
  );

  const [bookmarkedFilter, setBookmarkedFilter] = useState<boolean>(false);
  const { userWithId } = useUser();
  const userPosterIds = userWithId?.savedPosters ?? emptySavedPosters;

  const filteredPosterVenues = useMemo(
    () =>
      bookmarkedFilter
        ? liveFilteredPosterVenues.filter(
            (posterVenue) =>
              //@ts-ignore
              userPosterIds[posterVenue.id]?.[0] === posterVenue.id
          )
        : liveFilteredPosterVenues,
    [liveFilteredPosterVenues, bookmarkedFilter, userPosterIds]
  );

  // See https://fusejs.io/api/options.html
  const fuseVenues = useMemo(
    () =>
      new Fuse(filteredPosterVenues, {
        keys: [
          "name",
          {
            name: "poster.title",
            weight: 20,
          },
          {
            name: "poster.authorName",
            weight: 16,
          },
          "poster.categories",
          {
            name: "poster.authors",
            weight: 8,
          },
          "poster.keywords",
          "poster.introduction",
        ],
        threshold: 0.2, // 0.1 seems to be exact, default 0.6: brings too distant if anyhow related hits
        ignoreLocation: true, // default False: True - to search ignoring location of the words.
        findAllMatches: true,
      }),
    [filteredPosterVenues]
  );

  const searchedPosterVenues = useMemo(
    () =>
      isEmptyQuery
        ? filteredPosterVenues
        : fuseVenues
            .search({
              $and: tokenizedSearchQuery.map((searchToken: string) => {
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
            .map((fuseResult) => fuseResult.item),
    [fuseVenues, filteredPosterVenues, isEmptyQuery, tokenizedSearchQuery]
  );

  const displayedPosterVenues = useMemo(
    () => searchedPosterVenues.slice(0, displayedPostersCount),
    [searchedPosterVenues, displayedPostersCount]
  );

  const hasHiddenPosters =
    searchedPosterVenues.length > displayedPosterVenues.length;

  const value = {
    posterVenues: displayedPosterVenues,
    isPostersLoaded,
    hasHiddenPosters,

    searchInputValue,
    liveFilter,
    bookmarkedFilter,

    increaseDisplayedPosterCount,
    setSearchInputValue,
    setLiveFilter,
    setBookmarkedFilter,
  };

  return (
    <PostersContext.Provider value={value}>{children}</PostersContext.Provider>
  );
};

export const usePostersContext = (): PostersContextState => {
  const postersContextState = useContext(PostersContext);

  if (!postersContextState) {
    throw new Error(
      "<PostersContext/> not found. Did you forget to include it in your component hierarchy?"
    );
  }

  return postersContextState;
};

export const filterLiveEvents = (
  nonPosterSubVenueEvents: WithVenueId<VenueEvent>[]
) => nonPosterSubVenueEvents.filter((event) => isEventLive(event));

export const useLiveEventNonPosterSubVenues = (posterHallId: string) => {
  const { relatedVenues } = useRelatedVenues({
    currentVenueId: posterHallId,
  });

  const nonPosterSubVenueIds = useMemo(
    () =>
      relatedVenues
        .filter(
          (relatedVenue) =>
            relatedVenue.parentId === posterHallId &&
            relatedVenue.template !== VenueTemplate.posterpage
        )
        .map((venue) => venue.id),
    [relatedVenues, posterHallId]
  );

  const { events: nonPosterSubVenueEvents, isEventsLoading } = useVenueEvents({
    venueIds: nonPosterSubVenueIds,
  });

  const [
    liveNonPosterSubVenueEvents,
    setLiveNonPosterSubVenueEvents,
  ] = useState<WithVenueId<VenueEvent>[]>();

  const updateLiveEvents = useCallback(() => {
    if (isEventsLoading) return;

    const filteredLiveEvents = filterLiveEvents(nonPosterSubVenueEvents);

    setLiveNonPosterSubVenueEvents(filteredLiveEvents);
  }, [nonPosterSubVenueEvents, isEventsLoading]);

  useEffect(() => updateLiveEvents(), [updateLiveEvents]);

  useInterval(() => {
    updateLiveEvents();
  }, POSTERHALL_SUBVENUE_STATUS_MS);

  return {
    liveNonPosterSubVenueEvents,
  };
};
