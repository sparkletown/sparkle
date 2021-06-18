import React, { useMemo } from "react";

import { GenericVenue } from "types/venues";

import { WithId } from "utils/id";

import { usePosters } from "hooks/posters";

import { Button } from "components/atoms/Button";
import { PosterCategory } from "components/atoms/PosterCategory";

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

    categoryList,
    categoryFilter,
    setCategoryFilter,
    unsetCategoryFilter,
  } = usePosters(venue.id);

  const shouldShowMorePosters = isPostersLoaded && hasHiddenPosters;

  const renderedPosterPreviews = useMemo(() => {
    return posterVenues.map((posterVenue) => (
      <PosterPreview key={posterVenue.id} posterVenue={posterVenue} />
    ));
  }, [posterVenues]);

  const renderedCategoryOptions = useMemo(
    () => (
      <div className="PosterHall__categories">
        <PosterCategory
          key="All posters"
          category="All posters"
          onClick={unsetCategoryFilter}
          containerClassname="PosterHall__category"
          active={categoryFilter === undefined}
        />
        {categoryList.map((category) => {
          if (!category) return [];
          return (
            <PosterCategory
              key={category}
              category={category}
              onClick={() => setCategoryFilter(category)}
              containerClassname="PosterHall__category"
              active={category === categoryFilter}
            />
          );
        })}
      </div>
    ),
    [categoryList, categoryFilter, setCategoryFilter, unsetCategoryFilter]
  );

  return (
    <div className="PosterHall">
      <PosterHallSearch
        setSearchInputValue={setSearchInputValue}
        searchInputValue={searchInputValue}
        liveFilterValue={liveFilter}
        setLiveValue={setLiveFilter}
      />

      {renderedCategoryOptions}

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
