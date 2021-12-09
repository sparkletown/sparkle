import React from "react";
import classNames from "classnames";

import "./AdminShowcase.scss";

export interface AdminShowcaseProps {
  className?: string;
}

export const AdminShowcase: React.FC<AdminShowcaseProps> = ({
  className,
  children,
}) => {
  const containerClasses = classNames("AdminShowcase", className);
  return <div className={containerClasses}>{children}</div>;
};
