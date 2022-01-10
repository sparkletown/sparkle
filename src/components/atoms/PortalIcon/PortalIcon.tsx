import React from "react";

import { ROOM_TAXON } from "settings";

import "./PortalIcon.scss";

export interface PortalIconProps {
  src: string;
}

export const PortalIcon: React.FC<PortalIconProps> = ({ src }) => (
  <div className="PortalIcon">
    <img
      className="PortalIcon__image"
      src={src}
      alt={`${ROOM_TAXON.capital} icon`}
    />
  </div>
);
