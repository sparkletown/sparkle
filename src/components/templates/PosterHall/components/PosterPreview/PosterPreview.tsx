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

  const renderedCategories = useMemo(
    () =>
      Array.from(new Set(categories)).map((category) => (
        <div key={category} className="PosterPreview__category">
          {category}
        </div>
      )),
    [categories]
  );

  return (
    <div className={posterClassnames} onClick={onClick}>
      <p className="PosterPreview__title">{title}</p>

      <div className="PosterPreview__categories">{renderedCategories}</div>

      <div className="PosterPreview__author">{authorName}</div>
    </div>
  );
};
