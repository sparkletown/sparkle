import React, { ReactNode, useMemo } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import classNames from "classnames";
import { get } from "lodash";

import { AnyForm } from "types/utility";

import { generateId } from "utils/string";

import "./AdminInput.scss";

export interface AdminInputProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "label"> {
  name: string;
  label?: ReactNode | string;
  subtext?: ReactNode | string;
  errors?: FieldErrors<FieldValues>;
  hidden?: boolean;
  register: UseFormRegister<AnyForm> | (() => void);
}

/**
 * @deprecated Use Input component instead.
 * @see src/components/admin/Input/
 */
export const AdminInput: React.FC<AdminInputProps> = ({
  name,
  label,
  subtext,
  errors,
  hidden,
  disabled,
  register,
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

  const hiddenClasses = classNames(parentClasses, "AdminInput__input");

  return hidden ? (
    <input
      {...inputProps}
      {...register(name)}
      className={hiddenClasses}
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
        {...register(name)}
        className="AdminInput__input"
        id={id}
        disabled={disabled}
      />
      {subtext && <span className="AdminInput__subtext">{subtext}</span>}
      {error && <span className="AdminInput__error">{error?.message}</span>}
    </p>
  );
};
