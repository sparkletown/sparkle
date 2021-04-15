import React from "react";

import { usePosterFilters, usePosters } from "hooks/posters";

import { GenericVenue } from "types/venues";

import { WithId } from "utils/id";

import { PosterPreview } from "./components/PosterPreview";
import { Search } from "./components/Search";

import "./PosterHall.scss";

export interface PosterHallProps {
  venue: WithId<GenericVenue>;
}

export const PosterHall: React.FC<PosterHallProps> = ({ venue }) => {
  const { titleFilter, categoriesFilter, setTitleFilter } = usePosterFilters();

  const { posterVenues } = usePosters({
    titleFilter,
    categoriesFilter,
    posterHallId: venue.id,
  });

  return (
    <div className="posterhall">
      <Search setTitleValue={setTitleFilter} titleValue={titleFilter} />

      <div className="posterhall__posters">
        {posterVenues?.map((posterVenue) => (
          <PosterPreview posterVenue={posterVenue} key={posterVenue.id} />
        ))}
      </div>
    </div>
  );
};
