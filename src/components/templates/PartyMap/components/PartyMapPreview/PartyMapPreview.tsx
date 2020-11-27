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

export const PartyMapPreview: FC<PartyMapPreviewProps> = ({
  expanded,
  backgroundImage,
  backgroundRatio,
  avatarPosition,
  rooms,
  onIconClick,
}) => {
  return (
    <div
      className={`map-zoom-preview ${expanded && "expand"}`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        width: expanded ? "80vh" : 120,
        height: expanded ? `${80 / backgroundRatio}vh` : 120 / backgroundRatio,
      }}
    >
      <div className="map-zoom-icon" onClick={onIconClick}></div>
      <div className="map-zoom-position"></div>
      <div
        className="map-avatar-position"
        style={{ top: avatarPosition.x + "%", left: avatarPosition.y + "%" }}
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
        {/* <div className="map-zoom-room map-zoom-room-1" style='background-image:url("./img/map-room-1.png");'>	</div>
            <div className="map-zoom-room map-zoom-room-2" style='background-image:url("./img/map-room-2.png");'>	</div>
            <div className="map-zoom-room map-zoom-room-3" style='background-image:url("./img/map-room-3.png");'>	</div>
            <div className="map-zoom-room map-zoom-room-4" style='background-image:url("./img/map-room-4.png");'>	</div>
            <div className="map-zoom-room map-zoom-room-5" style='background-image:url("./img/map-room-5.png");'>	</div>
            <div className="map-zoom-room map-zoom-room-6" style='background-image:url("./img/map-room-6.png");'>	</div>
            <div className="map-zoom-room map-zoom-room-7" style='background-image:url("./img/map-room-7.png");'>	</div>
            <div className="map-zoom-room map-zoom-room-8" style='background-image:url("./img/map-room-8.png");'>	</div> */}
      </div>
    </div>
  );
};
