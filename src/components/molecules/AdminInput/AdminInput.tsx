import React, { ReactNode, useMemo } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import classNames from "classnames";
import { get } from "lodash";

import { generateId } from "utils/string";

import CN from "./AdminInput.module.scss";

export interface AdminInputProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "label"> {
  name: string;
  label?: ReactNode | string;
  subtext?: ReactNode | string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  errors?: FieldErrors<FieldValues>;
  hidden?: boolean;
}

export const AdminInput: React.FC<AdminInputProps> = ({
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
    () => (label ? generateId("AdminInput-" + name) : undefined),
    [label, name]
  );

  const parentClasses = classNames({
    AdminInput: true,
    "AdminInput--invalid": error,
    "AdminInput--disabled": disabled,
    "AdminInput--hidden": hidden,
    "AdminInput--visible": !hidden,
  });

  const inputClasses = classNames(
    "w-full shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md",
    CN.input
  );
  const hiddenClasses = classNames(parentClasses, inputClasses);

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
        <label className="AdminInput__label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        {...inputProps}
        className={inputClasses}
        name={name}
        ref={register}
        id={id}
        disabled={disabled}
      />
      {subtext && <span className="AdminInput__subtext">{subtext}</span>}
      {error && <span className="AdminInput__error">{error?.message}</span>}
    </p>
  );
};
