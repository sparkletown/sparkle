import { ButtonHTMLAttributes, RefObject } from "react";
import classNames from "classnames";

export type ButtonVariant = "primary" | "secondary";

export interface AdminButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  extraClasses?: string;
  variant?: ButtonVariant;
  forwaredRef?: RefObject<HTMLButtonElement>;
}

export const AdminButton: React.FC<AdminButtonProps> = ({
  extraClasses,
  children,
  variant = "primary",
  forwaredRef,
  ...extraParams
}) => {
  const classes = classNames(
    "w-full inline-flex justify-center rounded-md border shadow-sm px-4 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 sm:w-auto sm:text-sm",
    {
      "border-transparent bg-sparkle text-white hover:bg-sparkle-darker focus:ring-red-500 sm:ml-3":
        variant === "primary",
      "mt-3 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:ring-indigo-500 sm:mt-0 ":
        variant === "secondary",
    },
    extraClasses
  );

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
