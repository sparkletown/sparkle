import React from "react";
import classNames from "classnames";

import "./AdminPanel.scss";

export interface AdminPanelProps {
  className?: string;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  className,
  children,
}) => {
  const containerClasses = classNames("AdminPanel", className);
  return <div className={containerClasses}>{children}</div>;
};
