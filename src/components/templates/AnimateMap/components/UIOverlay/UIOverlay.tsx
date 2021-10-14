import React from "react";

import { AnimateMapVenue } from "types/venues";

import "./UIOverlay.scss";

export interface UIOverlayProps {
  venue: AnimateMapVenue;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ venue, children }) => {
  return <div className="UIOverlay">{children}</div>;
};
