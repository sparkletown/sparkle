import React from "react";

import "./UIContainer.scss";

export interface UIContainerProps {
  disableInteractive?: boolean;
}

export const UIContainer: React.FC<UIContainerProps> = ({
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
