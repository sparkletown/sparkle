import React from "react";

import { usePosterFilters, usePosters } from "hooks/posters";

import { TPoster } from "types/posters";

import { Poster } from "./components/Poster";
import { Search } from "./components/Search";

import "./Posters.scss";

const POSTERS: TPoster[] = Array(5).fill({
  title: "Skull aberration correction in ultrasound brain imaging",
  pdfUrl: "/pdf-sample.pdf",
  categories: [
    { title: "Brain Stimulation", color: "#c75786" },
    { title: "Sonic/Ultrasound", color: "#57c5c7" },
    {
      title: "Direct Electrical/Optogenetic Stimulation",
      color: "#79c757",
    },
  ],
  author: {
    name: "Daniel Gallitino",
    institution: "Douglas Mental Health Institute",
  },
});

export interface PostersProps {}

export const Posters: React.FC<PostersProps> = () => {
  const { titleFilter, categoriesFilter } = usePosterFilters();

  const { posterVenues } = usePosters({ titleFilter, categoriesFilter });

  return (
    <div className="posterhall">
      <Search />

      <div className="posterhall__posters">
        {POSTERS.map((poster) => (
          <Poster poster={poster} />
        ))}
      </div>
    </div>
  );
};
