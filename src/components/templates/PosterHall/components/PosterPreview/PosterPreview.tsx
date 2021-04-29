import React from "react";
import classNames from "classnames";

import { WithPoster } from "types/posters";
import { PosterVenue } from "types/venues";

import { WithId } from "utils/id";

import "./PosterPreview.scss";

export interface PosterProps {
  posterVenue: WithId<WithPoster<PosterVenue>>;
  onClick?: () => void;
}

export const PosterPreview: React.FC<PosterProps> = ({
  posterVenue,
  onClick,
}) => {
  // TODO: Remove poster object and put all of its properties into the venue itself
  const { title, author, categories } = posterVenue.poster;

  const posterClassnames = classNames("PosterPreview", {
    "PosterPreview--live": posterVenue.isLive,
  });

  return (
    <div className={posterClassnames} onClick={onClick}>
      <p className="PosterPreview__title">{title}</p>
      {categories?.length > 0 && (
        <div className="PosterPreview__categories">
          {categories.map((category) => (
            <div
              key={category.title + category.color}
              className="PosterPreview__category"
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
        <div className="PosterPreview__author">
          <div className="PosterPreview__author__name">{author.name}</div>
          <div className="PosterPreview__author__institution">
            {author.institution}
          </div>
        </div>
      )}
    </div>
  );
};
