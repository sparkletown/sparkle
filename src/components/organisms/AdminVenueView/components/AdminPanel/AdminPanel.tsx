import React from "react";
import classNames from "classnames";

import "./AdminPanel.scss";

export interface AdminPanelProps {
  className?: string;
  variant: "bound" | "unbound";
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  className,
  children,
  variant,
}) => {
  const containerClasses = classNames(
    "AdminPanel",
    className,
    `AdminPanel--${variant ?? "bound"}`
  );
  return <div className={containerClasses}>{children}</div>;
};
