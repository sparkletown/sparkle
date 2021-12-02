import React from "react";
import classNames from "classnames";

import "./AdminShowcase.scss";

export interface AdminShowcaseProps {
  className?: string;
  variant?: "internal-scroll" | "no-scroll";
}

export const AdminShowcase: React.FC<AdminShowcaseProps> = ({
  className,
  variant = "internal-scroll",
  children,
}) => {
  const containerClasses = classNames(
    "AdminShowcase",
    className,
    `AdminShowcase--${variant}`
  );
  return <div className={containerClasses}>{children}</div>;
};
