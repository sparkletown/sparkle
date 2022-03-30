import React, { ButtonHTMLAttributes, RefObject } from "react";
import classNames from "classnames";

import CN from "./Button.module.scss";

// Button And Border variant types are the same to allow variant mixing.
// But we might have different variants for either button or border in the future
type ButtonVariant = "primary" | "alternative" | "login";
type BorderVariant = ButtonVariant;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  variant?: ButtonVariant;
  transparent?: boolean;
  border?: BorderVariant;
  className?: string;
  forwardRef?: RefObject<HTMLButtonElement> | null;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = "",
  className,
  transparent,
  forwardRef,
  border,
  ...rest
}) => {
  const buttonClasses = classNames(
    CN.button,
    className,
    CN["variant-" + variant],
    CN["border-" + border],
    {
      [CN.transparent]: transparent,
    }
  );

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      ref={forwardRef}
      {...rest}
    >
      {children}
    </button>
  );
};
