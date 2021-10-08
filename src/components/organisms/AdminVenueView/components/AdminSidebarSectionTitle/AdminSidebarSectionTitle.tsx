import React from "react";

import "./AdminSidebarSectionTitle.scss";

export interface AdminSidebarSectionTitleProps {}

export const AdminSidebarSectionTitle: React.FC<AdminSidebarSectionTitleProps> = ({
  children,
}) => {
  return <h2 className="AdminSidebarSectionTitle"> {children}</h2>;
};
