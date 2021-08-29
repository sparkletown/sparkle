import React from "react";
import classNames from "classnames";

import "./PaneRF.scss";

export const PaneRF: React.FC<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>
> = ({ className, children, ...props }) => {
  const componentClasses = classNames("PaneRF", className);
  return (
    <div {...props} className={componentClasses}>
      <div className="PaneRF__content mod--flex-col">{children}</div>
    </div>
  );
};
