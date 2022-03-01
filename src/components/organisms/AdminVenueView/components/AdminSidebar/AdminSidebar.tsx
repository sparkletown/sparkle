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
    "AdminSidebar xl:col-start-1 xl:col-span-1",
    `AdminSidebar--${variant}`
  );

  return (
    <section className={containerClasses}>
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        {children}
      </div>
    </section>
  );
};
