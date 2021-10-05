import React from "react";
import classNames from "classnames";

import "./AdminShowcaseTitle.scss";

export interface AdminShowcaseTitleProps {
  className?: string;
}

export const AdminShowcaseTitle: React.FC<AdminShowcaseTitleProps> = ({
  className,
  children,
}) => {
  const containerClasses = classNames("AdminShowcaseTitle", className);
  return <h2 className={containerClasses}> {children}</h2>;
};
