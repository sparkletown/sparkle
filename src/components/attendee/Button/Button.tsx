import React, {
  ButtonHTMLAttributes,
  MouseEventHandler,
  RefObject,
} from "react";
import classNames from "classnames";

import CN from "./Button.module.scss";

// Button And Border variant types are the same to allow variant mixing.
// But we might have different variants for either button or border in the future
type ButtonVariant =
  | "primary"
  | "alternative"
  | "login"
  | "login-primary"
  | "intensive"
  | "danger"
  // A variant that pins the button to the bottom of the container and makes
  // it full width
  | "panel-primary";
type BorderVariant = ButtonVariant;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: MouseEventHandler<HTMLButtonElement>;
  variant?: ButtonVariant;
  transparent?: boolean;
  border?: BorderVariant;
  unrounded?: boolean;
  marginless?: boolean;
  paddingless?: boolean;
  large?: boolean;
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
  border = "",
  unrounded = false,
  marginless = false,
  paddingless = false,
  large = false,
  disabled,
  ...rest
}) => {
  const buttonClasses = classNames(
    CN.button,
    className,
    CN["variant-" + variant],
    CN["border-" + border],
    {
      [CN.transparent]: transparent,
      [CN.borderRadiusNone]: unrounded,
      [CN.buttonMarginNone]: marginless,
      [CN.buttonPaddingNone]: paddingless,
      [CN.disabled]: disabled,
      [CN.large]: large,
    }
  );

  return (
    <button
      data-bem="Button"
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
