import { AppButton } from "components/atoms/Button/Button";
import React from "react";
import "./Button.scss";

interface ButtonWithLabelProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  onClick: () => void;
  rightLabel?: string;
  leftLabel?: string;
  small?: boolean;
  disabled?: boolean;
}

export const ButtonWithLabel: React.FC<ButtonWithLabelProps> = ({
  children,
  variant = "primary",
  onClick,
  rightLabel,
  leftLabel,
  small,
  disabled = false,
}) => {
  return (
    <div className="button-with-label">
      {leftLabel && <p>{leftLabel}</p>}
      <AppButton
        customClass={`btn ${small && "btn-small"} btn-${variant}`}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </AppButton>
      {rightLabel && <p>{rightLabel}</p>}
    </div>
  );
};
