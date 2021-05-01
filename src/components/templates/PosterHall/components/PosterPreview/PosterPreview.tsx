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
  const { title, authorName, categories } = posterVenue.poster ?? {};

  const posterClassnames = classNames("PosterPreview", {
    "PosterPreview--live": posterVenue.isLive,
  });

  const hasCategories = categories?.length && categories.length > 0;

  const renderedCategories = useMemo(
    () => (
      <div className="PosterPreview__categories">
        {categories?.map((category, index) => (
          <div key={`category_${index}`} className="PosterPreview__category">
            {category}
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

      <div className="PosterPreview__author">{authorName}</div>
    </div>
  );
};
