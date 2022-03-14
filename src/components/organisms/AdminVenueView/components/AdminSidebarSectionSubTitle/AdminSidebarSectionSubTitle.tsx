import React from "react";

import "./AdminSidebarSectionSubTitle.scss";

export interface AdminSidebarSectionSubTitleProps {}

/**
 * @deprecated Use InputGroupSubtitle component instead.
 */
export const AdminSidebarSectionSubTitle: React.FC<AdminSidebarSectionSubTitleProps> = ({
  children,
}) => <p className="AdminSidebarSectionSubTitle"> {children}</p>;
