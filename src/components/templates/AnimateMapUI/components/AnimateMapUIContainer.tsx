import React from "react";

import { AnimateMapSpace } from "../../AnimateMapCommon";

import "./AnimateMapUIContainer.scss";

export interface AnimateMapUIContainerProps {
  venue: AnimateMapSpace;
  disableInteractive?: boolean;
}

export const AnimateMapUIContainer: React.FC<AnimateMapUIContainerProps> = ({
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
