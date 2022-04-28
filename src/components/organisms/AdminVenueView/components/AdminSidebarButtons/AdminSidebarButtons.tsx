import React from "react";

export const AdminSidebarButtons: React.FC = ({ children }) => (
  <div className="AdminSidebarButtons mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
    {children}
  </div>
);
