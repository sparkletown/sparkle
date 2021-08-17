import React from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import "./Centered.scss";

export const Centered: React.FC<
  React.PropsWithChildren<ContainerClassName>
> = ({ children, containerClassName }) => {
  return (
    <div className={classNames("Centered", containerClassName)}>{children}</div>
  );
};
