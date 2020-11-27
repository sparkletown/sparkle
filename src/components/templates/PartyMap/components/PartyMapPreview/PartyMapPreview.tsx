import React, { FC } from "react";
import { PartyMapRoomData } from "types/PartyMapRoomData";

interface PartyMapPreviewProps {
  expanded: boolean;
  backgroundImage?: string;
  backgroundRatio: number;
  avatarPosition: {
    x: number;
    y: number;
  };
  rooms: PartyMapRoomData[];
  onIconClick: () => void;
}

const PREVIEW_WIDTH_PIXELS = 120;
const PREVIEW_WIDTH_VH = 80;

export const PartyMapPreview: FC<PartyMapPreviewProps> = ({
  expanded,
  backgroundImage,
  backgroundRatio,
  avatarPosition,
  rooms,
  onIconClick,
}) => {
  // Calculating the height of the expanded and unexpanded preview with the aspect ratio.
  const defaultHeight = PREVIEW_WIDTH_PIXELS / backgroundRatio;
  const expandedHeight = `${PREVIEW_WIDTH_VH / backgroundRatio}vh`;

  // Expanded preview width and height are using vh
  // Unexpanded preview width and height are using pixels
  const previewWidth = expanded
    ? `${PREVIEW_WIDTH_VH}vh`
    : PREVIEW_WIDTH_PIXELS;
  const previewHeight = expanded ? expandedHeight : defaultHeight;

  const avatarTop = avatarPosition.x + "%";
  const avatarLeft = avatarPosition.y + "%";
  return (
    <div
      className={`map-zoom-preview ${expanded && "expand"}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        width: previewWidth,
        height: previewHeight,
      }}
    >
      <div className="map-zoom-icon" onClick={onIconClick}></div>
      <div className="map-zoom-position"></div>
      <div
        className="map-avatar-position"
        style={{ top: avatarTop, left: avatarLeft }}
      ></div>
      <div className="map-zoom-rooms">
        {rooms.map((room: PartyMapRoomData, index: number) => {
          const left = room.x_percent;
          const top = room.y_percent;
          const width = room.width_percent;
          const height = room.height_percent;
          return (
            <div
              key={`room-preview-${index}`}
              className="map-zoom-room"
              style={{
                left: left + "%",
                top: top + "%",
                width: width + "%",
                height: height + "%",
                backgroundImage: `url(${room.image_url})`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
};
