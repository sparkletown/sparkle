import React, { useMemo, useState } from "react";

import { GenericVenue, VenueTemplate } from "types/venues";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";
import { isEventLive } from "utils/event";

import { usePosters } from "hooks/posters";
import { useVenueEvents } from "hooks/events";
import { useRelatedVenues } from "hooks/useRelatedVenues";
import { useInterval } from "hooks/useInterval";

import { Button } from "components/atoms/Button";

import { PosterPreview } from "./components/PosterPreview";
import { PosterHallSearch } from "./components/PosterHallSearch";

import { POSTERHALL_SUBVENUE_STATUS_MS } from "settings";

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

  const [liveVenueIds, setLiveVenueIds] = useState<string[]>();

  const { relatedVenues } = useRelatedVenues({
    currentVenueId: venue.id,
  });

  const subVenues = useMemo(() => {
    return relatedVenues.filter(
      (relatedVenue) =>
        relatedVenue.parentId === venue.id &&
        relatedVenue.template !== VenueTemplate.posterpage
    );
  }, [relatedVenues, venue]);

  const subVenueIds = useMemo(() => subVenues.map((venue) => venue.id), [
    subVenues,
  ]);

  const { events: subVenueEvents } = useVenueEvents({
    venueIds: subVenueIds,
  });

  useInterval(() => {
    setLiveVenueIds(
      subVenueEvents
        .filter((event) => isEventLive(event))
        .map((event) => event.venueId)
    );
  }, POSTERHALL_SUBVENUE_STATUS_MS);

  const renderedSubvenues = useMemo(() => {
    if (liveVenueIds)
      return subVenues
        .filter((subVenue) => liveVenueIds.includes(subVenue.id))
        .map((subVenue) => (
          <PosterPreview
            key={subVenue.id}
            posterVenue={subVenue as WithId<PosterPageVenue>}
            enterVenue={enterVenue}
          />
        ));
  }, [liveVenueIds, subVenues]);

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
