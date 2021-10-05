import React from "react";
import classNames from "classnames";

import "./CenterContent.scss";

export const CenterContent: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div className={classNames("CenterContent", className)} {...rest}>
      {children}
    </div>
  );
};
