import React from "react";

import "./PosterCategory.scss";

export interface PosterCategoryProps {
  category: string;
}

export const PosterCategory: React.FC<PosterCategoryProps> = ({ category }) => (
  <span className="PosterCategory">{category}</span>
);
