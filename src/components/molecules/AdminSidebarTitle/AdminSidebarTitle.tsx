import React from "react";
import classNames from "classnames";

import "./AdminSidebarTitle.scss";

export interface AdminSidebarTitleProps {
  className?: string;
}

export const AdminSidebarTitle: React.FC<AdminSidebarTitleProps> = ({
  className,
  children,
}) => {
  const containerClasses = classNames("AdminSidebarTitle", className);
  return <h1 className={containerClasses}> {children}</h1>;
};
