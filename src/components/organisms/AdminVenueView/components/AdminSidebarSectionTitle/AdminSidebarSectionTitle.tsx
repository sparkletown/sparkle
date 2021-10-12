import React from "react";
import classNames from "classnames";

import "./AdminSidebarSectionTitle.scss";


export const AdminSidebarSectionTitle: React.FC = ({
  className,
  children,
}) => (
  <h2 className="AdminSidebarSectionTitle">
    {children}
  </h2>
);
