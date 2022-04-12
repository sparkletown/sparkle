import React, { useMemo } from "react";

import { GenericSpaceWithId } from "types/id";

import { usePosters } from "hooks/posters";

import { ButtonOG } from "components/atoms/ButtonOG";

import { PosterHallSearch } from "./components/PosterHallSearch";
import { PosterPreview } from "./components/PosterPreview";

interface PosterHallProps {
  venue: GenericSpaceWithId;
}

export const PosterHall: React.FC<PosterHallProps> = ({ venue }) => {
  const {
    posterVenues,
    isPostersLoaded,
    hasHiddenPosters,

    increaseDisplayedPosterCount,

    searchInputValue,
    setSearchInputValue,
  } = usePosters(venue.id);

  const shouldShowMorePosters = isPostersLoaded && hasHiddenPosters;

  const renderedPosterPreviews = useMemo(() => {
    const sortedVenues = [...posterVenues].sort(
      (a, b) => (b.recentUserCount ?? 0) - (a.recentUserCount ?? 0)
    );
    return sortedVenues.map((posterVenue) => (
      <PosterPreview key={posterVenue.id} posterVenue={posterVenue} />
    ));
  }, [posterVenues]);

  return (
    <div
      data-bem="PosterHall"
      data-block="PosterHall"
      data-side="att"
      className="PosterHall"
    >
      <PosterHallSearch
        setSearchInputValue={setSearchInputValue}
        searchInputValue={searchInputValue}
      />

      <div
        data-bem="PosterHall__posters"
        data-side="att"
        className="PosterHall__posters"
      >
        {isPostersLoaded ? renderedPosterPreviews : "Loading posters"}
      </div>

      <div className="PosterHall__more-button">
        {shouldShowMorePosters && (
          <ButtonOG onClick={increaseDisplayedPosterCount}>
            Show more posters
          </ButtonOG>
        )}
      </div>
    </div>
  );
};
