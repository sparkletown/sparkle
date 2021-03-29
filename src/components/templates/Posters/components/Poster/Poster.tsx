import React from "react";

import { TPoster } from "../../Posters";

import "./Poster.scss";

export interface PosterProps {
  poster: TPoster;
}

export const Poster: React.FC<PosterProps> = ({ poster }) => {
  const { title, pdfUrl, author, categories } = poster;

  return (
    <div className="poster">
      <div className="poster__pdf">
        <iframe src={pdfUrl} width="100%" />

        <div className="poster__pdf__actions">
          <button className="poster__pdf__actions__join-btn">Join</button>
        </div>
      </div>

      <p className="poster__title">{title}</p>
      <div className="poster__categories">
        {categories.map((category) => (
          <div
            className="poster__category"
            style={{
              backgroundColor: category.color,
            }}
          >
            {category.title}
          </div>
        ))}
      </div>
      <div className="poster__author">
        <div className="poster__author__name">{author.name}</div>
        <div className="poster__author__institution">{author.institution}</div>
      </div>
    </div>
  );
};
