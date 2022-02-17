import React from "react";

import "./AdminSidebarSectionTitle.scss";

export const AdminSidebarSectionTitle: React.FC = ({ children }) => (
  <h2 className="block text-sm font-medium text-gray-700">{children}</h2>
);
