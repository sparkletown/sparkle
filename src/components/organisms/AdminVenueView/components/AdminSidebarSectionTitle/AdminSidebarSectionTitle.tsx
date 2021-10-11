import React from "react";
import classNames from "classnames";

import "./AdminSidebarSectionTitle.scss";

export interface AdminSidebarSectionTitleProps {
  className?: string;
}

export const AdminSidebarSectionTitle: React.FC<AdminSidebarSectionTitleProps> = ({
  className,
  children,
}) => (
  <h2 className={classNames("AdminSidebarSectionTitle", className)}>
    {children}
  </h2>
);
