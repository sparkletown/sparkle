import React, { ReactNode, useMemo } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import { useCss } from "react-use";
import classNames from "classnames";

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
  isTextarea?: boolean;
}

export const AdminInput: React.FC<AdminInputProps> = ({
  name,
  label,
  subtext,
  register,
  errors,
  height,
  isTextarea,
  ...inputProps
}) => {
  const error = errors?.[name];
  const id = useMemo(
    () => (label ? generateId("AdminInput-" + name) : undefined),
    [label, name]
  );

  const inputVars = useCss({ height: height ? `${height}px` : "auto" });

  const inputClasses = classNames("AdminInput__input", inputVars);

  return (
    <p className="AdminInput">
      {label && (
        <label className="AdminInput__label" htmlFor={id}>
          {label}
        </label>
      )}
      {isTextarea ? (
        <textarea
          className={inputClasses}
          name={name}
          ref={register}
          id={id}
          placeholder={inputProps.placeholder}
        />
      ) : (
        <input
          {...inputProps}
          className={inputClasses}
          name={name}
          ref={register}
          id={id}
        />
      )}
      {subtext && <span className="AdminInput__subtext">{subtext}</span>}
      {error && <span className="AdminInput__error">{error?.message}</span>}
    </p>
  );
};
