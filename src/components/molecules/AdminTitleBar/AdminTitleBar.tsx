import React from "react";

import "./AdminTitleBar.scss";

export interface AdminTitleBarProps {
  className?: string;
}

export const AdminTitleBar: React.FC<AdminTitleBarProps> = ({
  children,
  className,
}) => <div className={`AdminTitleBar ${className}`}>{children}</div>;
