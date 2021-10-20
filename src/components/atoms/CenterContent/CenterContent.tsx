import React from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import "./CenterContent.scss";

export const CenterContent: React.FC<
  React.PropsWithChildren<ContainerClassName>
> = ({ children, containerClassName }) => {
  return (
    <div className={classNames("CenterContent", containerClassName)}>
      {children}
    </div>
  );
};
