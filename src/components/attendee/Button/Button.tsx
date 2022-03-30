import { ButtonHTMLAttributes, MouseEventHandler, RefObject } from "react";
import classNames from "classnames";

import CN from "./Button.module.scss";

// Button And Border variant types are the same to allow variant mixing.
// But we might have different variants for either button or border in the future
type ButtonVariant = "primary" | "alternative" | "intensive" | "danger";
type BorderVariant = ButtonVariant;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: ButtonVariant;
  transparent?: boolean;
  border?: BorderVariant;
  unrounded?: boolean;
  marginless?: boolean;
  className?: string;
  forwardRef?: RefObject<HTMLButtonElement> | null;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = "primary",
  className,
  transparent,
  forwardRef,
  border,
  unrounded = false,
  marginless = false,
  disabled,
  ...rest
}) => {
  const buttonClasses = classNames(CN.button, className, CN[variant], {
    [CN.transparent]: transparent,
    [CN.borderAlternative]: border === "alternative",
    [CN.borderIntensive]: border === "intensive",
    [CN.borderRadiusNone]: unrounded,
    [CN.buttonMarginNone]: marginless,
    [CN.disabled]: disabled,
  });

  return (
    <button
      className={buttonClasses}
      onClick={onClick}
      ref={forwardRef}
      disabled={disabled}
      {...rest}
    >
      {children}
    </button>
  );
};
