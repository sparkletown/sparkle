import React from "react";
import classNames from "classnames";

import "./AdminTitleBar.scss";

export interface AdminTitleBarProps {
  variant: "simple-title" | "two-rows" | "grid-with-tools";
}

export const AdminTitleBar: React.FC<AdminTitleBarProps> = ({
  variant,
  children,
}) => {
  const parentClasses = classNames(
    "AdminTitleBar",
    `AdminTitleBar--${variant}`
  );
  return <div className={parentClasses}>{children}</div>;
};
