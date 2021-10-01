import React from "react";

import { ROOM_TAXON } from "settings";

import "./RoomIcon.scss";

export interface RoomIconProps {
  src: string;
  className?: string;
}

export const RoomIcon: React.FC<RoomIconProps> = ({ src, className }) => (
  <div className={`RoomIcon__wrapper ${className}`}>
    <img
      className="RoomIcon__image"
      src={src}
      alt={`${ROOM_TAXON.capital} icon`}
    />
  </div>
);
