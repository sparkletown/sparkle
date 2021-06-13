import React, { useMemo } from "react";

import { GenericVenue } from "types/venues";

import { WithId } from "utils/id";

import { usePosters, usePosterHallSubVenues } from "hooks/posters";

import { Button } from "components/atoms/Button";

import { PosterPreview } from "./components/PosterPreview";
import { SubVenuePreview } from "./components/SubVenuePreview";
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
  } = usePosters(venue.id);

  const shouldShowMorePosters = isPostersLoaded && hasHiddenPosters;

  const renderedPosterPreviews = useMemo(() => {
    return posterVenues.map((posterVenue) => (
      <PosterPreview key={posterVenue.id} posterVenue={posterVenue} />
    ));
  }, [posterVenues]);

  const { liveVenueEvents } = usePosterHallSubVenues(venue.id);

  const renderedSubvenues = useMemo(() => {
    if (!liveVenueEvents) return;
    return liveVenueEvents.map((subVenueEvent) => (
      <SubVenuePreview
        key={subVenueEvent.venueId}
        venueId={subVenueEvent.venueId}
        title={subVenueEvent.name}
        host={subVenueEvent.host}
      />
    ));
  }, [liveVenueEvents]);

  return (
    <div className="PosterHall">
      <div className="PosterHall__related">{renderedSubvenues}</div>

      <PosterHallSearch
        setSearchInputValue={setSearchInputValue}
        searchInputValue={searchInputValue}
        liveFilterValue={liveFilter}
        setLiveValue={setLiveFilter}
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
