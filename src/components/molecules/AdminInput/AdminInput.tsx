import React, { ReactNode, useMemo } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import { get } from "lodash";

import { generateId } from "utils/string";

import "./AdminInput.scss";

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
  hidden: isHidden,
  ...inputProps
}) => {
  const error = get(errors, name);
  const id = useMemo(
    () => (label ? generateId("AdminInput-" + name) : undefined),
    [label, name]
  );

  return isHidden ? (
    <input
      {...inputProps}
      className="AdminInput AdminInput--hidden AdminInput__input"
      name={name}
      ref={register}
      id={id}
      type="hidden"
    />
  ) : (
    <p className="AdminInput AdminInput--visible">
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
