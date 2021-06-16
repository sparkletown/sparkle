import React from "react";

import { AppButton } from "components/atoms/Button/Button";

import "./Button.scss";
import classNames from "classnames";

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
  const buttonStyles = classNames("btn", `btn-${variant}`, {
    "btn-small": small,
  });

  return (
    <div className="ButtonWithLabel">
      {leftLabel && <p>{leftLabel}</p>}
      <AppButton
        customClass={buttonStyles}
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </AppButton>
      {rightLabel && <p>{rightLabel}</p>}
    </div>
  );
};
