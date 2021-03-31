import React, { useCallback } from "react";

import { TPoster, WithPoster } from "types/posters";
import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import "./Poster.scss";

export interface PosterProps {
  posterVenue: WithId<WithPoster<AnyVenue>>;
}

export const Poster: React.FC<PosterProps> = ({ posterVenue }) => {
  const { title, pdfUrl, author, categories } = posterVenue.poster;

  const enterPosterVenue = useCallback(() => enterVenue(posterVenue.id), []);

  return (
    <div className="poster">
      <div className="poster__pdf">
        <iframe src={pdfUrl} width="100%" />

        <div className="poster__pdf__actions">
          <button
            className="poster__pdf__actions__join-btn"
            onClick={enterPosterVenue}
          >
            Join
          </button>
        </div>
      </div>

      <p className="poster__title">{title}</p>
      {categories?.length > 0 && (
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
      )}
      {author && (
        <div className="poster__author">
          <div className="poster__author__name">{author.name}</div>
          <div className="poster__author__institution">
            {author.institution}
          </div>
        </div>
      )}
    </div>
  );
};
