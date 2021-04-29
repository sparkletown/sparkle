import React from "react";

import { GenericVenue } from "types/venues";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import { usePosters } from "hooks/posters";

import { PosterPreview } from "./components/PosterPreview";
import { PosterHallSearch } from "./components/PosterHallSearch";

import "./PosterHall.scss";

export interface PosterHallProps {
  venue: WithId<GenericVenue>;
}

export const PosterHall: React.FC<PosterHallProps> = ({ venue }) => {
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
    <div className="PosterHall">
      <PosterHallSearch
        setTitleValue={setTitleFilter}
        titleFilterValue={titleFilter}
        liveFilterValue={liveFilter}
        setLiveValue={setLiveFilter}
      />

      <div className="PosterHall__posters">
        {posterVenues?.map((posterVenue) => (
          <PosterPreview
            posterVenue={posterVenue}
            key={posterVenue.id}
            onClick={() => enterVenue(posterVenue.id)}
          />
        ))}
      </div>
    </div>
  );
};
