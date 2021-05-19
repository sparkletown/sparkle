import React from "react";
import classNames from "classnames";

import "./PosterCategory.scss";

export interface PosterCategoryProps {
  category: string;
  onClick?: () => void;
  containerClassname?: string;
}

export const PosterCategory: React.FC<PosterCategoryProps> = ({
  category,
  onClick,
  containerClassname,
}) => {
  const containerClasses = classNames("PosterCategory", containerClassname);

  return (
    <span className={containerClasses} onClick={onClick}>
      {category}
    </span>
  );
};
