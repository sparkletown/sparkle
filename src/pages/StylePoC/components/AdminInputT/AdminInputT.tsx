import React, { ReactNode, useMemo } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import classNames from "classnames";
import { get } from "lodash";

import { generateId } from "utils/string";

export interface AdminInputTProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "label"> {
  name: string;
  label?: ReactNode | string;
  subtext?: ReactNode | string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  errors?: FieldErrors<FieldValues>;
  hidden?: boolean;
}

export const AdminInputT: React.FC<AdminInputTProps> = ({
  name,
  label,
  subtext,
  register,
  errors,
  hidden,
  disabled,
  ...inputProps
}) => {
  const error = get(errors, name);
  const id = useMemo(
    () => (label ? generateId("AdminInputT-" + name) : undefined),
    [label, name]
  );

  const parentClasses = classNames({
    AdminInputT: true,
    "AdminInputT--invalid": error,
    "AdminInputT--disabled": disabled,
    "AdminInputT--hidden": hidden,
    "AdminInputT--visible": !hidden,
  });

  const hiddenClasses = classNames(parentClasses, "AdminInputT__input");

  return hidden ? (
    <input
      {...inputProps}
      className={hiddenClasses}
      name={name}
      ref={register}
      id={id}
      disabled={disabled}
      type="hidden"
    />
  ) : (
    <p className={parentClasses}>
      {label && (
        <label className="AdminInputT__label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        {...inputProps}
        className="AdminInputT__input shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        name={name}
        ref={register}
        id={id}
        disabled={disabled}
      />
      {subtext && <span className="AdminInputT__subtext">{subtext}</span>}
      {error && <span className="AdminInputT__error">{error?.message}</span>}
    </p>
  );
};
