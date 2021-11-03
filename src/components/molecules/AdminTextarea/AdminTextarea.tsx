import React, { ReactNode, useMemo } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import { get } from "lodash";

import { generateId } from "utils/string";

import "./AdminTextarea.scss";

export interface AdminTextareaProps
  extends Omit<React.HTMLProps<HTMLTextAreaElement>, "label"> {
  name: string;
  label?: ReactNode | string;
  subtext?: ReactNode | string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  errors?: FieldErrors<FieldValues>;
}

export const AdminTextarea: React.FC<AdminTextareaProps> = ({
  name,
  label,
  subtext,
  register,
  errors,
  ...inputProps
}) => {
  const error = get(errors, name);
  const id = useMemo(
    () => (label ? generateId("AdminTextarea-" + name) : undefined),
    [label, name]
  );
  return (
    <p className="AdminTextarea">
      {label && (
        <label className="AdminTextarea__label" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        {...inputProps}
        className="AdminTextarea__input"
        name={name}
        ref={register}
        id={id}
      />
      {subtext && <span className="AdminTextarea__subtext">{subtext}</span>}
      {error && <span className="AdminTextarea__error">{error?.message}</span>}
    </p>
  );
};
