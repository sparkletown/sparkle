import React, { ReactNode, useMemo } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import classNames from "classnames";
import { get } from "lodash";

import { generateId } from "utils/string";

export interface AdminTextareaTProps
  extends Omit<React.HTMLProps<HTMLTextAreaElement>, "label"> {
  name: string;
  label?: ReactNode | string;
  subtext?: ReactNode | string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  errors?: FieldErrors<FieldValues>;
}

export const AdminTextareaT: React.FC<AdminTextareaTProps> = ({
  name,
  label,
  subtext,
  register,
  errors,
  disabled,
  ...inputProps
}) => {
  const error = get(errors, name);
  const id = useMemo(
    () => (label ? generateId("AdminTextareaT-" + name) : undefined),
    [label, name]
  );

  const parentClasses = classNames({
    "AdminTextareaT mt-1": true,
    "AdminTextareaT--invalid": error,
    "AdminTextareaT--disabled": disabled,
  });

  return (
    <p className={parentClasses}>
      {label && (
        <label className="AdminTextareaT__label" htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        {...inputProps}
        className="AdminTextareaT__input shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
        name={name}
        ref={register}
        id={id}
        disabled={disabled}
      />
      {subtext && <span className="AdminTextareaT__subtext">{subtext}</span>}
      {error && <span className="AdminTextareaT__error">{error?.message}</span>}
    </p>
  );
};
