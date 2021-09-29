import React from "react";
import classNames from "classnames";

import "./AdminShowcaseSubTitle.scss";

export interface AdminShowcaseSubTitleProps {
  className?: string;
}

export const AdminShowcaseSubTitle: React.FC<AdminShowcaseSubTitleProps> = ({
  className,
  children,
}) => {
  const containerClasses = classNames("AdminShowcaseSubTitle", className);
  return <h2 className={containerClasses}> {children}</h2>;
};
