import React, { ReactNode, useMemo } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";

import { generateId } from "utils/string";

import "./AdminInput.scss";

export interface AdminInputProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "label"> {
  name: string;
  label?: ReactNode | string;
  subtext?: ReactNode | string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  errors?: FieldErrors<FieldValues>;
  height?: string;
}

export const AdminInput: React.FC<AdminInputProps> = ({
  name,
  label,
  subtext,
  register,
  errors,
  height,
  ...inputProps
}) => {
  const error = errors?.[name];
  const id = useMemo(
    () => (label ? generateId("AdminInput-" + name) : undefined),
    [label, name]
  );

  return (
    <p className="AdminInput">
      {label && (
        <label className="AdminInput__label" htmlFor={id}>
          {label}
        </label>
      )}
      <input
        {...inputProps}
        className="AdminInput__input"
        name={name}
        ref={register}
        id={id}
      />
      {subtext && <span className="AdminInput__subtext">{subtext}</span>}
      {error && <span className="AdminInput__error">{error?.message}</span>}
    </p>
  );
};
