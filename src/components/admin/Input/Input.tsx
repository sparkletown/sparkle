import React, { ReactNode, useMemo } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import classNames from "classnames";
import { get } from "lodash";

import { generateId } from "utils/string";

import * as TW from "./Input.tailwind";

import CN from "./Input.module.scss";

export interface InputProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "label"> {
  name: string;
  label?: ReactNode | string;
  subtext?: ReactNode | string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  errors?: FieldErrors<FieldValues>;
  hidden?: boolean;
}

export const Input: React.FC<InputProps> = ({
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
  const id = useMemo(() => (label ? generateId("Input-" + name) : undefined), [
    label,
    name,
  ]);

  const parentClasses = classNames({
    [TW.hidden]: hidden,
  });

  const inputClasses = classNames(TW.input, CN.input);
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
      {label && <label htmlFor={id}>{label}</label>}
      <input
        {...inputProps}
        className={inputClasses}
        name={name}
        ref={register}
        id={id}
        disabled={disabled}
      />
      {subtext && <span>{subtext}</span>}
      {error && <span className={TW.error}>{error?.message}</span>}
    </p>
  );
};