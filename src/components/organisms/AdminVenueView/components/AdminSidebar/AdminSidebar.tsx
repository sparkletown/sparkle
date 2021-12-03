import React from "react";
import classNames from "classnames";

import "./AdminSidebar.scss";

export interface AdminSidebarProps {
  variant?: "light" | "dark" | "transparent";
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  variant = "transparent",
  children,
}) => {
  const containerClasses = classNames(
    "AdminSidebar",
    `AdminSidebar--${variant}`
  );
  return <div className={containerClasses}> {children}</div>;
};
