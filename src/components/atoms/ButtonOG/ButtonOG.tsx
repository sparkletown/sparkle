import React from "react";
import { Link } from "react-router-dom";

interface LinkProps {
  isLink?: boolean;
  linkTo?: string;
}

export interface ButtonProps extends LinkProps {
  customClass?: string;
  gradient?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: "button" | "reset" | "submit";
  disabled?: boolean;
  notPrimary?: boolean;
}

export const ButtonOG: React.FC<ButtonProps> = ({
  customClass,
  loading,
  onClick,
  type = "button",
  children,
  gradient,
  isLink = false,
  linkTo,
  disabled = false,
}) => {
  if (loading)
    return (
      <div className="spinner-border">
        <span className="sr-only">Loading&hellip;</span>
      </div>
    );

  if (isLink && linkTo) {
    return (
      <Link className={customClass} to={linkTo}>
        {children}
      </Link>
    );
  }

  return (
    <button
      className={customClass}
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
