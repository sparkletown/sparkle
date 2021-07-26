import React from "react";
import classNames from "classnames";

import { Button } from "components/atoms/Button";

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
  const buttonStyles = classNames("btn", `btn-${variant}`, {
    "btn-small": small,
  });

  return (
    <div className="ButtonWithLabel">
      {leftLabel && <p>{leftLabel}</p>}
      <Button customClass={buttonStyles} onClick={onClick} disabled={disabled}>
        {children}
      </Button>
      {rightLabel && <p>{rightLabel}</p>}
    </div>
  );
};
