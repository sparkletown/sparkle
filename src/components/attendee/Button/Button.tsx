import { ButtonHTMLAttributes, RefObject } from "react";
import classNames from "classnames";

import CN from "./Button.module.scss";

type ButtonVariant = "primary" | "alternative";
type BorderVariant = ButtonVariant;
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
  variant,
  className,
  transparent,
  forwardRef,
  border,
  ...rest
}) => {
  const buttonClasses = classNames(`${CN.button} ${className}`, {
    [CN.primary]: variant === "primary",
    [CN.alternative]: variant === "alternative",
    [CN.transparent]: transparent,
    [CN.borderAlternative]: border === "alternative",
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
