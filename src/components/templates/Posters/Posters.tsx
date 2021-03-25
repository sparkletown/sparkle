import React from "react";

import { Poster } from "./components/Poster";

import "./Posters.scss";

export type TCategory = {
  title: string;
  color: string;
};

export type TPoster = {
  title: string;
  pdfUrl: string;
  categories: TCategory[];
  authors: [];
};

const POSTERS: TPoster[] = Array(5).fill({
  title: "Skull aberration correction in ultrasound brain imaging",
  pdfUrl: "/pdf-sample.pdf",
  categories: [{ title: "Brain Stimulation", color: "Sonic/Ultrasound" }],
  authors: [],
});

export interface PostersProps {}

export const Posters: React.FC<PostersProps> = () => {
  return (
    <div className="posters">
      {POSTERS.map((poster) => (
        <Poster poster={poster} />
      ))}
    </div>
  );
};
