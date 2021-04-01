import React from "react";

import { usePosterFilters, usePosters } from "hooks/posters";

import { Poster } from "./components/Poster";
import { Search } from "./components/Search";

import "./Posters.scss";

export interface PostersProps {}

export const Posters: React.FC<PostersProps> = () => {
  const { titleFilter, categoriesFilter, setTitleFilter } = usePosterFilters();

  const { posterVenues } = usePosters({ titleFilter, categoriesFilter });

  return (
    <div className="posterhall">
      <Search setTitleValue={setTitleFilter} titleValue={titleFilter} />

      <div className="posterhall__posters">
        {posterVenues?.map((posterVenue) => (
          <Poster posterVenue={posterVenue} key={posterVenue.id} />
        ))}
      </div>
    </div>
  );
};
