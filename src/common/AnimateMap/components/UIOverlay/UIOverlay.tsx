import React from "react";
import { AnimateMapVenueItem } from "common/AnimateMapCommon";

import "./UIOverlay.scss";

export interface UIOverlayProps {
  venue: AnimateMapVenueItem;
}

export const UIOverlay: React.FC<UIOverlayProps> = ({ venue, children }) => {
  return <div className="UIOverlay">{children}</div>;
};
