import React, { useState } from "react";

import { usePosters } from "hooks/posters";

import { GenericVenue, PosterVenue } from "types/venues";

import { WithId } from "utils/id";

import { PosterPreview } from "./components/PosterPreview";
import { Search } from "./components/Search";
import { PosterPreviewModal } from "./components/PosterPreviewModal";

import "./PosterHall.scss";

export interface PosterHallProps {
  venue: WithId<GenericVenue>;
}

export const PosterHall: React.FC<PosterHallProps> = ({ venue }) => {
  const [chosenPosterVenue, setChosenPosterVenue] = useState<
    WithId<PosterVenue> | undefined
  >();

  const hidePosterPreviewModal = () => {
    setChosenPosterVenue(undefined);
  };

  const hasChosenPosterVenue = chosenPosterVenue !== undefined;

  const {
    posterVenues,
    titleFilter,
    setTitleFilter,
    liveFilter,
    setLiveFilter,
  } = usePosters({
    posterHallId: venue.id,
  });

  return (
    <div className="posterhall">
      <Search
        setTitleValue={setTitleFilter}
        titleFilterValue={titleFilter}
        liveFilterValue={liveFilter}
        setLiveValue={setLiveFilter}
      />

      <div className="posterhall__posters">
        {posterVenues?.map((posterVenue) => (
          <PosterPreview
            posterVenue={posterVenue}
            key={posterVenue.id}
            onClick={() => setChosenPosterVenue(posterVenue)}
          />
        ))}
      </div>

      <PosterPreviewModal
        isVisible={hasChosenPosterVenue}
        onHide={hidePosterPreviewModal}
        posterVenue={chosenPosterVenue}
      />
    </div>
  );
};
