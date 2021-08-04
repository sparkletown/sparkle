import React from "react";
import { AnimateMapVenue } from "types/venues";
import "./UIContainer.scss";

export interface UIContainerProps {
  venue: AnimateMapVenue;
  disableInteractive?: boolean;
}

export const UIContainer: React.FC<UIContainerProps> = ({
  venue,
  disableInteractive,
  children,
}) => {
  return (
    <div
      className={`UIContainer ${
        disableInteractive ? "" : "UIContainer_enabled-interactive"
      }`}
    >
      {children}
    </div>
  );
};
