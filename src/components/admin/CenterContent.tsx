import React from "react";
import classNames from "classnames";

export const CenterContent: React.FC<React.HTMLProps<HTMLDivElement>> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <div
      className={classNames(
        "CenterContent absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4",
        className
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
