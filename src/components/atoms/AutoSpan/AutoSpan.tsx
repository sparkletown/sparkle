import React from "react";
import classNames from "classnames";

import "./AutoSpan.scss";

export type AutoSpanVariants = "error" | "info" | "secondary" | "dim";

export interface SpanRfProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  variant?: AutoSpanVariants;
}

export const AutoSpan: React.FC<SpanRfProps> = ({
  className = "",
  children,
  variant,
}) => {
  const componentClasses = classNames({
    AutoSpan: true,
    [`AutoSpan--${variant}`]: variant,
    [className]: className,
  });
  return children ? <span className={componentClasses}>{children}</span> : null;
};
