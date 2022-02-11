import { ButtonHTMLAttributes, RefObject } from "react";
import classNames from "classnames";

import * as TW from "./AdminButton.tailwind";

export type ButtonVariant = "primary" | "secondary";

export interface AdminButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  forwaredRef?: RefObject<HTMLButtonElement>;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  children,
  variant = "primary",
  forwaredRef,
  ...extraParams
}) => {
  const classes = classNames("AdminButton", TW.general, {
    [TW.primary]: variant === "primary",
    [TW.secondary]: variant === "secondary",
  });

  return (
    <button
      type="button"
      className={classes}
      ref={forwaredRef}
      {...extraParams}
    >
      {children}
    </button>
  );
};
