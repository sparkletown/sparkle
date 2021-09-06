import React from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import LoadingIcon from "assets/icons/icon-loading.svg";

import "./Loading.scss";

export interface LoadingProps extends ContainerClassName {
  label?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  containerClassName,
  label,
}) => {
  const containerClasses = classNames("Loading", containerClassName);

  return (
    <div className={containerClasses}>
      <img className="Loading__icon" src={LoadingIcon} alt="loading" />
      <span className="Loading__message">{label}</span>
    </div>
  );
};
