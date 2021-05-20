import React from "react";
import classNames from "classnames";

import "./PosterCategory.scss";

export interface PosterCategoryProps {
  category: string;
  onClick?: () => void;
  containerClassname?: string;
  active?: boolean;
}

export const PosterCategory: React.FC<PosterCategoryProps> = ({
  category,
  onClick,
  containerClassname,
  active: isActive,
}) => {
  const containerClasses = classNames("PosterCategory", containerClassname, {
    "PosterCategory--active": isActive,
  });

  return (
    <span className={containerClasses} onClick={onClick}>
      {category}
    </span>
  );
};
