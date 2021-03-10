import React from "react";

import "./SectionPreview.scss";

export interface SectionPreviewProps {
  onClick: () => void;
}

export const SectionPreview: React.FC<SectionPreviewProps> = ({ onClick }) => {
  return <div onClick={onClick} className="auditorium__section-preview" />;
};
