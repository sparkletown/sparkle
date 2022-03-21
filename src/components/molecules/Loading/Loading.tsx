import React from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { LoadingIcon } from "./LoadingIcon";

export interface LoadingProps extends ContainerClassName {
  label?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  containerClassName,
  label,
}) => {
  const containerClasses = classNames("Loading", containerClassName);
  return (
    <span className={containerClasses}>
      <LoadingIcon />
      <span className="Loading__message">{label}</span>
    </span>
  );
};
