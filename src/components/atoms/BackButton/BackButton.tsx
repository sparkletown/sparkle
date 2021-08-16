import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

import "./BackButton.scss";

export interface BackButtonProps {
  locationName?: string;
  onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  locationName,
  onClick,
}) => {
  const backButtonText = locationName ? `Back to ${locationName}` : "Back";

  return (
    <div className="BackButton" onClick={onClick}>
      <FontAwesomeIcon
        className="BackButton__icon"
        icon={faChevronLeft}
        size="sm"
      />
      <span className="BackButton__label">{backButtonText}</span>
    </div>
  );
};
