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
}

export const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant,
  ...rest
}) => {
  const buttonClasses = classNames(CN.Button, {
    [CN.ButtonPrimary]: variant === ButtonVariant.primary,
    [CN.ButtonAlternative]: variant === ButtonVariant.alternative,
    [CN.ButtonAlternativeBorder]: variant === ButtonVariant.alternativeBorder,
  });

  return (
    <button className={buttonClasses} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};
