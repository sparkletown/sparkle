import { ButtonHTMLAttributes, RefObject } from "react";
import cn from "classnames";

import { Loading } from "components/molecules/Loading";

import * as TW from "./Button.tailwind";

export type ButtonVariant = "primary" | "secondary" | "danger";
export type ButtonBorders = "regular" | "rounded";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  borders?: ButtonBorders;
  loading?: boolean;
  forwardRef?: RefObject<HTMLButtonElement>;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  borders = "regular",
  loading = false,
  forwardRef,
  type = "button",
  ...extraParams
}) => (
  <button
    {...extraParams}
    type={type}
    className={cn("Button", TW.general, TW[variant], TW[borders])}
    ref={forwardRef}
  >
    {loading && <Loading />}
    {children}
  </button>
);
