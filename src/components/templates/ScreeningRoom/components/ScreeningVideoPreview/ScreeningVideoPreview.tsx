import React from "react";
import classNames from "classnames";

import { ScreeningRoomVideo } from "types/screeningRoom";

import { WithId } from "utils/id";

import { PosterCategory } from "components/atoms/PosterCategory";

import "./ScreeningVideoPreview.scss";

export interface ScreeningVideoPreviewProps {
  video: WithId<ScreeningRoomVideo>;
  selectThisVideo: () => void;
  selected?: boolean;
}

export const ScreeningVideoPreview: React.FC<ScreeningVideoPreviewProps> = ({
  video,
  selectThisVideo,
  selected: isSelected,
}) => {
  const { title, category, authorName, thumbnailSrc } = video;

  const screeningVideoPreviewClasses = classNames("ScreeningVideoPreview", {
    "ScreeningVideoPreview--selected": isSelected,
  });

  return (
    <div className={screeningVideoPreviewClasses} onClick={selectThisVideo}>
      <img
        className="ScreeningVideoPreview__thumbnail"
        src={thumbnailSrc}
        alt="Video preview thumbnail"
      />
      <p className="ScreeningVideoPreview__title">{title}</p>

      <div className="ScreeningVideoPreview__categories">
        <PosterCategory key={category} category={category} active />
      </div>

      <div className="ScreeningVideoPreview__author">{authorName}</div>
    </div>
  );
};
