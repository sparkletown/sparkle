import React from "react";
import classNames from "classnames";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./PosterPageControl.scss";

export interface PosterPageControlProps {
  icon: IconProp;
  label: string;
  containerClassNames?: string;
  onClick?: () => void;
}

export const PosterPageControl: React.FC<PosterPageControlProps> = ({
  icon,
  label,
  containerClassNames,
  onClick,
}) => {
  const containerClasses = classNames("PosterPageControl", containerClassNames);

  return (
    <div className={containerClasses} onClick={onClick}>
      <FontAwesomeIcon icon={icon} size="lg" />
      <span className="PosterPageControl__label">{label}</span>
    </div>
  );
};
