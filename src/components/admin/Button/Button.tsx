import { ButtonHTMLAttributes, RefObject } from "react";
import cn from "classnames";

import * as TW from "./Button.tailwind";

export type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  forwardRef?: RefObject<HTMLButtonElement>;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  forwardRef,
  ...extraParams
}) => (
  <button
    type="button"
    className={cn("Button", TW.general, TW[variant])}
    ref={forwardRef}
    {...extraParams}
  >
    {children}
  </button>
);
