import { ButtonHTMLAttributes, RefObject } from "react";
import cn from "classnames";

import * as TW from "./AdminButton.tailwind";

export type ButtonVariant = "primary" | "secondary";

interface AdminButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  forwaredRef?: RefObject<HTMLButtonElement>;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  children,
  variant = "primary",
  forwaredRef,
  ...extraParams
}) => (
  <button
    type="button"
    className={cn("AdminButton", TW.general, TW[variant])}
    ref={forwaredRef}
    {...extraParams}
  >
    {children}
  </button>
);
