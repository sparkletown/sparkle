import { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

import CN from "./Button.module.scss";

type ButtonVariant = "primary" | "alternative" | "alternativeBorder";
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  variant?: ButtonVariant;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant,
  className,
  ...rest
}) => {
  const buttonClasses = classNames(`${CN.button} ${className}`, {
    [CN.buttonPrimary]: variant === "primary",
    [CN.buttonAlternative]: variant === "alternative",
    [CN.buttonAlternativeBorder]: variant === "alternativeBorder",
  });

  return (
    <button className={buttonClasses} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};
