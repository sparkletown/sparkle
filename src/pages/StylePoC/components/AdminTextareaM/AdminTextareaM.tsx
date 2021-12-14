import React, { ReactNode, useMemo } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import classNames from "classnames";
import { get } from "lodash";

import { generateId } from "utils/string";

import { generateClassNameGetter } from "../../util";

import CN from "./AdminTextareaM.module.scss";

const cn = generateClassNameGetter(CN);

export interface AdminTextareaMProps
  extends Omit<React.HTMLProps<HTMLTextAreaElement>, "label"> {
  name: string;
  label?: ReactNode | string;
  subtext?: ReactNode | string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  errors?: FieldErrors<FieldValues>;
}

export const AdminTextareaM: React.FC<AdminTextareaMProps> = ({
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
    () => (label ? generateId("AdminTextareaM-" + name) : undefined),
    [label, name]
  );

  const parentClasses = classNames({
    [cn("AdminTextareaM")]: true,
    [cn("AdminTextareaM--invalid")]: error,
    [cn("AdminTextareaM--disabled")]: disabled,
  });

  return (
    <p className={parentClasses}>
      {label && (
        <label className={cn("AdminTextareaM__label")} htmlFor={id}>
          {label}
        </label>
      )}
      <textarea
        {...inputProps}
        className={cn("AdminTextareaM__input")}
        name={name}
        ref={register}
        id={id}
        disabled={disabled}
      />
      {subtext && (
        <span className={cn("AdminTextareaM__subtext")}>{subtext}</span>
      )}
      {error && (
        <span className={cn("AdminTextareaM__error")}>{error?.message}</span>
      )}
    </p>
  );
};
