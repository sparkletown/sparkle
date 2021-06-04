import React from "react";
import "./Button.scss";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick: () => void;
  rightLabel?: string;
  leftLabel?: string;
  small?: boolean;
  disabled?: boolean;
}

const Button = ({
  children,
  variant = "primary",
  onClick,
  rightLabel,
  leftLabel,
  small,
  disabled = false,
}: ButtonProps) => {
  return (
    <div className="button-with-label">
      {leftLabel && <p>{leftLabel}</p>}
      <button
        className={`btn ${small && "btn-small"} btn-${variant}`}
        onClick={() => {
          onClick();
        }}
        disabled={disabled}
      >
        {children}
      </button>
      {rightLabel && <p>{rightLabel}</p>}
    </div>
  );
};

export default Button;
