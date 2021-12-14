import React, { ReactNode, useMemo } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import classNames from "classnames";
import { get } from "lodash";

import { generateId } from "utils/string";

import { generateClassNameGetter } from "../../util";

import CN from "./AdminInputM.module.scss";

const cn = generateClassNameGetter(CN);

export interface AdminInputMProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "label"> {
  name: string;
  label?: ReactNode | string;
  subtext?: ReactNode | string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  errors?: FieldErrors<FieldValues>;
  hidden?: boolean;
}

export const AdminInputM: React.FC<AdminInputMProps> = ({
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
    () => (label ? generateId("AdminInputM-" + name) : undefined),
    [label, name]
  );

  const parentClasses = classNames({
    [cn("AdminInputM")]: true,
    [cn("AdminInputM--invalid")]: error,
    [cn("AdminInputM--disabled")]: disabled,
    [cn("AdminInputM--hidden")]: hidden,
    [cn("AdminInputM--visible")]: !hidden,
  });

  const hiddenClasses = classNames(parentClasses, cn("AdminInputM__input"));

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
        <label className={cn("AdminInputM__label")} htmlFor={id}>
          {label}
        </label>
      )}
      <input
        {...inputProps}
        className={cn("AdminInputM__input")}
        name={name}
        ref={register}
        id={id}
        disabled={disabled}
      />
      {subtext && <span className={cn("AdminInputM__subtext")}>{subtext}</span>}
      {error && (
        <span className={cn("AdminInputM__error")}>{error?.message}</span>
      )}
    </p>
  );
};
