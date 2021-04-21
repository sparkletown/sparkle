import React from "react";
import classNames from "classnames";

import { WithPoster } from "types/posters";
import { PosterVenue } from "types/venues";

import { WithId } from "utils/id";

import "./PosterPreview.scss";

export interface PosterProps {
  posterVenue: WithId<WithPoster<PosterVenue>>;
  onClick: () => void;
}

export const PosterPreview: React.FC<PosterProps> = ({
  posterVenue,
  onClick,
}) => {
  const { title, pdfUrl, author, categories } = posterVenue.poster;

  const posterClassnames = classNames("poster-preview", {
    "poster-preview--live": posterVenue.isLive,
  });

  return (
    <div className={posterClassnames} onClick={onClick}>
      <div className="poster-preview__pdf">
        <iframe
          src={pdfUrl}
          width="100%"
          title={title}
          className="poster-preview__pdf-iframe"
        />
      </div>

      <p className="poster-preview__title">{title}</p>
      {categories?.length > 0 && (
        <div className="poster-preview__categories">
          {categories.map((category) => (
            <div
              key={category.title + category.color}
              className="poster-preview__category"
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
        <div className="poster-preview__author">
          <div className="poster-preview__author__name">{author.name}</div>
          <div className="poster-preview__author__institution">
            {author.institution}
          </div>
        </div>
      )}
    </div>
  );
};
