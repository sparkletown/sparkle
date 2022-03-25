import { ButtonHTMLAttributes, RefObject } from "react";
import classNames from "classnames";

import CN from "./Button.module.scss";

// Button And Border variant types are the same to allow variant mixing.
// But we might have different variants for either button or border in the future
type ButtonVariant = "primary" | "alternative" | "intensive" | "danger";
type BorderVariant = ButtonVariant;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  variant?: ButtonVariant;
  transparent?: boolean;
  border?: BorderVariant;
  rounded?: boolean;
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
  rounded = true,
  marginless = false,
  ...rest
}) => {
  const buttonClasses = classNames(CN.button, className, CN[variant], {
    [CN.transparent]: transparent,
    [CN.borderAlternative]: border === "alternative",
    [CN.borderIntensive]: border === "intensive",
    [CN.borderRadiusNone]: !rounded,
    [CN.buttonMarginNone]: marginless,
  });

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
