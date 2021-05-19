import React from "react";

import { ScreeningRoomVideo } from "types/screeningRoom";

import { WithId } from "utils/id";

import { PosterCategory } from "components/atoms/PosterCategory";

import "./ScreeningVideoPreview.scss";

export interface ScreeningVideoPreviewProps {
  video: WithId<ScreeningRoomVideo>;
  selectThisVideo: () => void;
}

export const ScreeningVideoPreview: React.FC<ScreeningVideoPreviewProps> = ({
  video,
  selectThisVideo,
}) => {
  const { title, category, authorName } = video;

  return (
    <div className="ScreeningVideoPreview" onClick={selectThisVideo}>
      <p className="ScreeningVideoPreview__title">{title}</p>

      <div className="ScreeningVideoPreview__categories">
        <PosterCategory key={category} category={category} />
      </div>

      <div className="ScreeningVideoPreview__author">{authorName}</div>
    </div>
  );
};
