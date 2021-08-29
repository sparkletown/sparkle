import React from "react";
import classNames from "classnames";

import "./SpanRF.scss";

export type SpanRfVariants = "error" | "secondary" | "dim";

export interface SpanRfProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLSpanElement>,
    HTMLSpanElement
  > {
  variant?: SpanRfVariants;
}

export const SpanRF: React.FC<SpanRfProps> = ({
  className = "",
  children,
  variant,
}) => {
  const componentClasses = classNames({
    DivRF: true,
    [`SpanRF--${variant}`]: variant,
    [className]: className,
  });
  return children ? <span className={componentClasses}>{children}</span> : null;
};
