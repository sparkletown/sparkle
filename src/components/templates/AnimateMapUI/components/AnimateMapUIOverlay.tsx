import React from "react";

import { AnimateMapSpace } from "../../AnimateMapCommon";

import "./AnimateMapUIOverlay.scss";

export interface AnimateMapUIOverlayProps {
  venue: AnimateMapSpace;
}

export const AnimateMapUIOverlay: React.FC<AnimateMapUIOverlayProps> = ({
  venue,
  children,
}) => {
  return <div className="UIOverlay">{children}</div>;
};
