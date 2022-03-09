import { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

import CN from "./Button.module.scss";

type ButtonVariant =
  | "primary"
  | "alternative"
  | "alternativeBorder"
  | "primaryAlternate";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
  forwardRef?: React.RefObject<HTMLButtonElement> | null;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant,
  className,
  forwardRef,
  ...rest
}) => {
  const buttonClasses = classNames(`${CN.button} ${className}`, {
    [CN.buttonPrimary]: variant === "primary",
    [CN.buttonAlternative]: variant === "alternative",
    [CN.buttonAlternativeBorder]: variant === "alternativeBorder",
    [CN.buttonPrimaryAlternate]: variant === "primaryAlternate",
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
