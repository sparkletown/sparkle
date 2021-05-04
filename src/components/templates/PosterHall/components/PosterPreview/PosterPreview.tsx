import React, { useCallback, useMemo } from "react";
import classNames from "classnames";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";

import "./PosterPreview.scss";

export interface PosterPreviewProps {
  posterVenue: WithId<PosterPageVenue>;
  enterVenue: (venueId: string) => void;
}

export const PosterPreview: React.FC<PosterPreviewProps> = ({
  posterVenue,
  enterVenue,
}) => {
  const { title, authorName, categories } = posterVenue.poster ?? {};

  const venueId = posterVenue.id;

  const posterClassnames = classNames("PosterPreview", {
    "PosterPreview--live": posterVenue.isLive,
  });

  const handleEnterVenue = useCallback(() => enterVenue(venueId), [
    enterVenue,
    venueId,
  ]);

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
    <div className={posterClassnames} onClick={handleEnterVenue}>
      <p className="PosterPreview__title">{title}</p>

      <div className="PosterPreview__categories">{renderedCategories}</div>

      <div className="PosterPreview__author">{authorName}</div>
    </div>
  );
};
