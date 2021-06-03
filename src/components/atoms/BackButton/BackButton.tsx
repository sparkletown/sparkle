import React from "react";

interface BackButtonProps {
  title?: string;
  onClick: () => void;
}

export const BackButton: React.FC<BackButtonProps> = ({
  title = "Back",
  onClick,
}) => (
  <div className="back-map-btn" onClick={onClick}>
    <div className="back-icon" />
    <span className="back-link">{title}</span>
  </div>
);
