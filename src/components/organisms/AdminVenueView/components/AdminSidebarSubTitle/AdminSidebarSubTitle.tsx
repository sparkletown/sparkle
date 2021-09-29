import React from "react";
import classNames from "classnames";

import "./AdminSidebarSubTitle.scss";

export interface AdminSidebarSubTitleProps {
  className?: string;
}

export const AdminSidebarSubTitle: React.FC<AdminSidebarSubTitleProps> = ({
  className,
  children,
}) => {
  const containerClasses = classNames("AdminSidebarSubTitle", className);
  return <h2 className={containerClasses}> {children}</h2>;
};
