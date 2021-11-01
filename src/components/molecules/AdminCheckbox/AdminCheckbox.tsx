import React, { ReactNode } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { CheckboxProps } from "components/atoms/Checkbox";

import "./AdminCheckbox.scss";

export interface AdminCheckboxProps
  extends Omit<CheckboxProps, "label" | "toggler"> {
  className?: string;
  errors?: FieldErrors<FieldValues>;
  label?: ReactNode | string;
  labelPosition?: "before" | "after";
  name: string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  subtext?: ReactNode | string;
  variant?: "toggler" | "checkbox";
}

export const AdminCheckbox: React.FC<AdminCheckboxProps> = ({
  className = "",
  disabled,
  errors,
  label,
  labelPosition = "after",
  name,
  register,
  subtext,
  variant = "checkbox",
  ...inputProps
}) => {
  const error = errors?.[name];

  const parentClasses = classNames({
    "AdminCheckbox AdminCheckbox--disabled": disabled,
    "AdminCheckbox AdminCheckbox--enabled": !disabled,
    [`AdminCheckbox--${variant}`]: variant,
    [`AdminCheckbox--label-${labelPosition}`]: labelPosition,
    [className]: className,
  });

  const input = (
    <>
      <input
        {...inputProps}
        className="AdminCheckbox__input"
        type="checkbox"
        hidden
        name={name}
        ref={register}
      />
      <span className="AdminCheckbox__box">
        <FontAwesomeIcon
          className="AdminCheckbox__tick"
          icon={faCheck}
          size="sm"
        />
      </span>
    </>
  );

  return (
    <p className={parentClasses}>
      {label ? (
        <label className="AdminCheckbox__label">
          {labelPosition === "before" && label}
          {input}
          {labelPosition === "after" && label}
        </label>
      ) : (
        input
      )}
      {subtext && <span className="AdminCheckbox__subtext">{subtext}</span>}
      {error && <span className="AdminCheckbox__error">{error?.message}</span>}
    </p>
  );
};
