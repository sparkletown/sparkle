import React from "react";

import "./AdminSidebarSectionTitle.scss";

/**
 * @deprecated Use InputGroupTitle component instead.
 */
export const AdminSidebarSectionTitle: React.FC = ({ children }) => (
  <h2 className="AdminSidebarSectionTitle">{children}</h2>
);
