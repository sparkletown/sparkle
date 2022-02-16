import { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

import styles from "./Button.module.scss";

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
  const buttonClasses = classNames(styles.Button, {
    [styles.Button__primary]: variant === ButtonVariant.primary,
    [styles.Button__alternative]: variant === ButtonVariant.alternative,
    [styles.Button__alternativeBorder]:
      variant === ButtonVariant.alternativeBorder,
  });

  return (
    <button className={buttonClasses} onClick={onClick} {...rest}>
      {children}
    </button>
  );
};
