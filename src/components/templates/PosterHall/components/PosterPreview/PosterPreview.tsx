import React, { useCallback, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { useCss } from "react-use";
import classNames from "classnames";

import { PosterPageSpaceWithId } from "types/id";

import { enterSpace } from "utils/url";

import { useValidImage } from "hooks/image/useValidImage";
import { useWorldParams } from "hooks/worlds/useWorldParams";

import { PosterCategory } from "components/atoms/PosterCategory";

import { PosterAttendance } from "../PosterAttendance";

export interface PosterPreviewProps {
  posterVenue: PosterPageSpaceWithId;
}

export const PosterPreview: React.FC<PosterPreviewProps> = ({
  posterVenue,
}) => {
  const { title, presenterName, categories, thumbnailUrl } =
    posterVenue.poster ?? {};

  const { worldSlug } = useWorldParams();

  const posterClassnames = classNames("PosterPreview", {
    "PosterPreview--live": posterVenue.isLive,
  });

  const { push: openUrlUsingRouter } = useHistory();

  const handleEnterVenue = useCallback(
    () =>
      enterSpace(worldSlug, posterVenue.slug, {
        customOpenRelativeUrl: openUrlUsingRouter,
      }),
    [worldSlug, posterVenue.slug, openUrlUsingRouter]
  );

  const renderedCategories = useMemo(
    () =>
      Array.from(new Set(categories)).map((category) => (
        <PosterCategory key={category} category={category} active />
      )),
    [categories]
  );

  const userCount = posterVenue.recentUserCount ?? 0;

  const {
    src: validatedThumbnailUrl,
    isValid: isThumbnailValid,
  } = useValidImage(thumbnailUrl, "");

  const thumbnailStyles = useCss({
    backgroundImage: `url(${validatedThumbnailUrl})`,
  });

  return (
    <div className={posterClassnames} onClick={handleEnterVenue}>
      <div className="PosterPreview__header">
        <p className="PosterPreview__title">{title}</p>
        <PosterAttendance userCount={userCount} />
      </div>

      {presenterName && (
        <p className="PosterPreview__author-box">
          Presented by: {presenterName}
        </p>
      )}

      {thumbnailUrl && isThumbnailValid && (
        <div
          className={`PosterPreview__thumbnail-container ${thumbnailStyles}`}
        />
      )}

      <div className="PosterPreview__categories">{renderedCategories}</div>
    </div>
  );
};
