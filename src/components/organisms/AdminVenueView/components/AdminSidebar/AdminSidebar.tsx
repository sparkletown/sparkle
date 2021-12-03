import React from "react";
import classNames from "classnames";

import "./AdminSidebar.scss";

export interface AdminSidebarProps {
  variant?: "light" | "dark";
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  variant,
  children,
}) => {
  const containerClasses = classNames(
    "AdminSidebar",
    `AdminSidebar--${variant}`
  );
  return <div className={containerClasses}> {children}</div>;
};
