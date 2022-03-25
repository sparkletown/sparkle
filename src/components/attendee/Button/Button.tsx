import { ButtonHTMLAttributes, RefObject } from "react";
import classNames from "classnames";

import CN from "./Button.module.scss";

// Button And Border variant types are the same to allow variant mixing.
// But we might have different variants for either button or border in the future
type ButtonVariant = "primary" | "alternative" | "intensive" | "danger";
type BorderVariant = ButtonVariant;
type BorderRadius = "regular" | "none";
type ButtonMargin = "regular" | "none";
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  variant?: ButtonVariant;
  transparent?: boolean;
  border?: BorderVariant;
  borderRadius?: BorderRadius;
  margin?: ButtonMargin;
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
  borderRadius,
  margin,
  ...rest
}) => {
  const buttonClasses = classNames(CN.button, className, CN[variant], {
    [CN.transparent]: transparent,
    [CN.borderAlternative]: border === "alternative",
    [CN.borderIntensive]: border === "intensive",
    [CN.borderRadiusNone]: borderRadius === "none",
    [CN.buttonMarginNone]: margin === "none",
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
