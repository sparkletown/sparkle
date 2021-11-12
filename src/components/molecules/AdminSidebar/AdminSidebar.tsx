import React from "react";
import classNames from "classnames";

import "./AdminSidebar.scss";

export interface AdminSidebarProps {
  className?: string;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  className,
  children,
}) => {
  const containerClasses = classNames("AdminSidebar", className);
  return <div className={containerClasses}> {children}</div>;
};
