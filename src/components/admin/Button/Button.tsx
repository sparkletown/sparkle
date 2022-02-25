import { ButtonHTMLAttributes, RefObject } from "react";
import cn from "classnames";

import { Loading } from "components/molecules/Loading";

import * as TW from "./Button.tailwind";

export type ButtonVariant = "primary" | "secondary";
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
  ...extraParams
}) => (
  <button
    type="button"
    className={cn("Button", TW.general, TW[variant], TW[borders])}
    ref={forwardRef}
    {...extraParams}
  >
    {loading && <Loading />}
    {children}
  </button>
);
