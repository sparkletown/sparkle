import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import { useHistory } from "react-router-dom";

import { PosterPageVenue } from "types/venues";

import { WithId } from "utils/id";
import { enterVenue } from "utils/url";

import { PosterCategory } from "components/atoms/PosterCategory";

import { PosterBookmark } from "../PosterBookmark";

import "./PosterPreview.scss";

export interface PosterPreviewProps {
  posterVenue: WithId<PosterPageVenue>;
  showBookmarks?: boolean;
}

export const PosterPreview: React.FC<PosterPreviewProps> = ({
  posterVenue,
  showBookmarks = false,
}) => {
  const { title, authorName, categories } = posterVenue.poster ?? {};

  const venueId = posterVenue.id;

  const posterClassnames = classNames("PosterPreview", {
    "PosterPreview--live": posterVenue.isLive,
  });

  const { push: openUrlUsingRouter } = useHistory();
  const handleEnterVenue = useCallback(
    (e) => {
      if (e.target.closest("PosterPreview__bookmark")) return;

      enterVenue(venueId, { customOpenRelativeUrl: openUrlUsingRouter });
    },
    [venueId, openUrlUsingRouter]
  );

  const renderedCategories = useMemo(
    () =>
      Array.from(new Set(categories)).map((category) => (
        <PosterCategory key={category} category={category} active />
      )),
    [categories]
  );

  return (
    <div className={posterClassnames} onClick={handleEnterVenue}>
      <div className="PosterPreview__bookmark">
        {showBookmarks && <PosterBookmark posterVenue={posterVenue} />}
      </div>
      <p className="PosterPreview__title">{title}</p>

      <div className="PosterPreview__categories">{renderedCategories}</div>

      <div className="PosterPreview__author">{authorName}</div>
    </div>
  );
};
