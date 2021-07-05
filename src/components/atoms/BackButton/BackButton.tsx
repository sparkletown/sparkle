import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

export interface BackButtonProps {
  label?: string;
  onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  label = "Back",
  onClick,
}) => (
  <div className="BackButton" onClick={onClick}>
    <FontAwesomeIcon
      className="BackButton__icon"
      icon={faChevronLeft}
      size="sm"
    />
    <span className="BackButton__label">{label}</span>
  </div>
);
