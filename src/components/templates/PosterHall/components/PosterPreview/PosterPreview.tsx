import React, { useMemo } from "react";
import classNames from "classnames";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";

import "./PosterPreview.scss";

export interface PosterPreviewProps {
  posterVenue: WithId<PosterPageVenue>;
  onClick?: () => void;
}

export const PosterPreview: React.FC<PosterPreviewProps> = ({
  posterVenue,
  onClick,
}) => {
  const { title, author, categories } = posterVenue.poster ?? {};

  const posterClassnames = classNames("PosterPreview", {
    "PosterPreview--live": posterVenue.isLive,
  });

  const hasCategories = categories?.length && categories.length > 0;

  const renderedCategories = useMemo(
    () => (
      <div className="PosterPreview__categories">
        {categories?.map((category) => (
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
    ),
    [categories]
  );

  return (
    <div className={posterClassnames} onClick={onClick}>
      <p className="PosterPreview__title">{title}</p>

      {hasCategories && renderedCategories}

      {author && (
        <div className="PosterPreview__author">
          <div className="PosterPreview__author-name">{author.name}</div>
          <div className="PosterPreview__author-institution">
            {author.institution}
          </div>
        </div>
      )}
    </div>
  );
};
