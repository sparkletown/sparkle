import React from "react";

import "./BackButton.scss";

export interface BackButtonProps {
  title?: string;
  onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  title = "Back",
  onClick,
}) => (
  <div className="BackButton" onClick={onClick}>
    <div className="BackButton__icon" />
    {title}
  </div>
);
