import React from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import "./PosterCategory.scss";

export interface PosterCategoryProps extends ContainerClassName {
  category: string;
  onClick?: () => void;
  active?: boolean;
}

export const PosterCategory: React.FC<PosterCategoryProps> = ({
  category,
  onClick,
  containerClassName,
  active: isActive,
}) => {
  const containerClasses = classNames("PosterCategory", containerClassName, {
    "PosterCategory--active": isActive,
  });

  return (
    <span className={containerClasses} onClick={onClick}>
      {category}
    </span>
  );
};
