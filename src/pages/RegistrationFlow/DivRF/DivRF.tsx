import React from "react";
import classNames from "classnames";

import "./DivRF.scss";

export type DivRfVariants = "title" | "subtitle";

export interface DivRfProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  variant?: DivRfVariants;
}

export const DivRF: React.FC<DivRfProps> = ({
  className = "",
  variant,
  children,
  ...props
}) => {
  const componentClasses = classNames({
    DivRF: true,
    [`DivRF--${variant}`]: variant,
    [className]: className,
  });
  return children ? (
    <div {...props} className={componentClasses}>
      {children}
    </div>
  ) : null;
};
