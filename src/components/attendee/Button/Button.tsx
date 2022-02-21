import { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

import CN from "./Button.module.scss";

enum ButtonVariant {
  primary = "primary",
  alternative = "alternative",
  alternativeBorder = "alternativeBorder",
}
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  variant?: "primary" | "alternative" | "alternativeBorder";
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
    [CN.buttonPrimary]: variant === ButtonVariant.primary,
    [CN.buttonAlternative]: variant === ButtonVariant.alternative,
    [CN.buttonAlternativeBorder]: variant === ButtonVariant.alternativeBorder,
  });

  return (
    <button className={buttonClasses} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};
