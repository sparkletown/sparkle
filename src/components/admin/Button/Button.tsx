import { ButtonHTMLAttributes, RefObject } from "react";
import cn from "classnames";

import { Loading } from "components/molecules/Loading";

import * as TW from "./Button.tailwind";

export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonBorders = "regular" | "rounded" | "none";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  borders?: ButtonBorders;
  loading?: boolean;
  forwardRef?: RefObject<HTMLButtonElement>;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  borders = "regular",
  loading = false,
  forwardRef,
  type = "button",
  className,
  ...extraParams
}) => (
  <button
    {...extraParams}
    type={type}
    className={cn("Button", TW.general, TW[variant], TW[borders], className)}
    ref={forwardRef}
  >
    {loading && <Loading />}
    {children}
  </button>
);
