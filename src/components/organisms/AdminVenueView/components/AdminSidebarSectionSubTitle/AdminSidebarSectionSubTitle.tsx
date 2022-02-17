import React from "react";

import "./AdminSidebarSectionSubTitle.scss";

export interface AdminSidebarSectionSubTitleProps {}

export const AdminSidebarSectionSubTitle: React.FC<AdminSidebarSectionSubTitleProps> = ({
  children,
}) => <p className="mb-1 text-sm text-gray-500"> {children}</p>;
