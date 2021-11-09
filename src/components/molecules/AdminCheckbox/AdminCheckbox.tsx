import React, { ReactNode } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { get } from "lodash";

import { CheckboxProps } from "components/atoms/Checkbox";

import "./AdminCheckbox.scss";

export interface AdminCheckboxProps
  extends Omit<CheckboxProps, "label" | "toggler" | "flip-switch"> {
  className?: string;
  errors?: FieldErrors<FieldValues>;
  label?: ReactNode | string;
  labelAfter?: string;
  name: string;
  textOn?: string;
  textOff?: string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  subtext?: ReactNode | string;
  variant?: "toggler" | "checkbox" | "flip-switch";
}

export const AdminCheckbox: React.FC<AdminCheckboxProps> = ({
  className = "",
  disabled,
  errors,
  label,
  name,
  textOn,
  textOff,
  register,
  subtext,
  variant = "checkbox",
  ...inputProps
}) => {
  const error = get(errors, name);
  const parentClasses = classNames({
    "AdminCheckbox AdminCheckbox--disabled": disabled,
    "AdminCheckbox AdminCheckbox--enabled": !disabled,
    [`AdminCheckbox--${variant}`]: variant,
    [className]: className,
  });

  const input = (
    <>
      <input
        {...inputProps}
        className="AdminCheckbox__input"
        type="checkbox"
        hidden
        disabled={disabled}
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

  const isToggleFlip = variant === "flip-switch";
  const isInputWithLabel = label || isToggleFlip;

  return (
    <p className={parentClasses}>
      {isInputWithLabel ? (
        <label className="AdminCheckbox__label">
          {isToggleFlip && (
            <span className="AdminCheckbox__label--before">{textOff}</span>
          )}
          {input}
          {label && label}
          {isToggleFlip && textOn}
        </label>
      ) : (
        input
      )}
      {subtext && <span className="AdminCheckbox__subtext">{subtext}</span>}
      {error && <span className="AdminCheckbox__error">{error?.message}</span>}
    </p>
  );
};
