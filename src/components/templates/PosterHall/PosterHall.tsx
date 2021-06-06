import React, { useMemo } from "react";

import { GenericVenue } from "types/venues";

import { WithId } from "utils/id";

import { usePosters } from "hooks/posters";

import { Button } from "components/atoms/Button";

import { PosterPreview } from "./components/PosterPreview";
import { PosterHallSearch } from "./components/PosterHallSearch";

import "./PosterHall.scss";

export interface PosterHallProps {
  venue: WithId<GenericVenue>;
}

export const PosterHall: React.FC<PosterHallProps> = ({ venue }) => {
  const {
    posterVenues,
    isPostersLoaded,
    hasHiddenPosters,

    increaseDisplayedPosterCount,

    searchInputValue,
    setSearchInputValue,
    liveFilter,
    setLiveFilter,

    bookmarkedFilter,
    setBookmarkedFilter,
  } = usePosters(venue.id);

  const shouldShowMorePosters = isPostersLoaded && hasHiddenPosters;

  const renderedPosterPreviews = useMemo(() => {
    return posterVenues.map((posterVenue) => (
      <PosterPreview
        key={posterVenue.id}
        posterVenue={posterVenue}
        showBookmarks={venue?.showBookmarks}
      />
    ));
  }, [posterVenues, venue]);

  return (
    <div className="PosterHall">
      <PosterHallSearch
        setSearchInputValue={setSearchInputValue}
        searchInputValue={searchInputValue}
        liveFilterValue={liveFilter}
        setLiveValue={setLiveFilter}
        bookmarkedFilterValue={bookmarkedFilter}
        setBookmarkedValue={setBookmarkedFilter}
        showBookmarks={venue?.showBookmarks}
      />

      <div className="PosterHall__posters">
        {isPostersLoaded ? renderedPosterPreviews : "Loading posters"}
      </div>

      <div className="PosterHall__more-button">
        {shouldShowMorePosters && (
          <Button onClick={increaseDisplayedPosterCount}>
            Show more posters
          </Button>
        )}
      </div>
    </div>
  );
};
