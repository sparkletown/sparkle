import React from "react";

import "./AdminShowcase.scss";

export const AdminShowcase: React.FC = ({ children }) => {
  return (
    <div className="AdminShowcase space-y-6 lg:col-start-2 lg:col-span-2">
      {children}
    </div>
  );
};
