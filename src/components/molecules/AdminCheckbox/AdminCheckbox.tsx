import React, { ReactNode } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { get } from "lodash";

import { AnyForm } from "types/utility";

import { CheckboxProps } from "components/atoms/Checkbox";

import "./AdminCheckbox.scss";

export interface AdminCheckboxProps
  extends Omit<CheckboxProps, "label" | "toggler" | "flip-switch"> {
  className?: string;
  errors?: FieldErrors<FieldValues>;
  label?: ReactNode | string;
  labelPosition?: "before" | "after" | "above";
  name: string;
  displayOn?: ReactNode | string;
  displayOff?: ReactNode | string;
  register: UseFormRegister<AnyForm>;
  subtext?: ReactNode | string;
  variant?: "toggler" | "checkbox" | "flip-switch";
}

export const AdminCheckbox: React.FC<AdminCheckboxProps> = ({
  className = "",
  disabled,
  errors,
  label,
  labelPosition = "after",
  name,
  displayOn,
  displayOff,
  register,
  subtext,
  variant = "checkbox",
  tabIndex,
  ...inputProps
}) => {
  const error = get(errors, name);

  const parentClasses = classNames({
    "AdminCheckbox AdminCheckbox--disabled": disabled,
    "AdminCheckbox AdminCheckbox--enabled": !disabled,
    [`AdminCheckbox--${variant}`]: variant,
    [`AdminCheckbox--label-${labelPosition}`]: labelPosition,
    [className]: className,
  });

  const input = (
    <span className="AdminCheckbox__flip-wrapper">
      {variant === "flip-switch" && (
        <span className="AdminCheckbox__off">{displayOff}</span>
      )}
      {/* NOTE: must always have label around input and the following span for the click to be shared */}
      {/* NOTE: multiple labels per input are OK, so keep this one empty of any text, use surrounding label for it */}
      <label className="AdminCheckbox__input-wrapper">
        <input
          {...inputProps}
          className="AdminCheckbox__input"
          type="checkbox"
          hidden
          disabled={disabled}
          {...register(name)}
        />
        <span className="AdminCheckbox__box">
          <FontAwesomeIcon
            className="AdminCheckbox__tick"
            icon={faCheck}
            size="sm"
          />
        </span>
      </label>
      {variant === "flip-switch" && (
        <span className="AdminCheckbox__on">{displayOn}</span>
      )}
    </span>
  );

  return (
    <p className={parentClasses} tabIndex={tabIndex}>
      {label ? (
        <label className="AdminCheckbox__label">
          {(labelPosition === "before" || labelPosition === "above") && (
            <span className="AdminCheckbox__label-wrapper">{label}</span>
          )}

          {input}

          {labelPosition === "after" && (
            <span className="AdminCheckbox__label-wrapper">{label}</span>
          )}
        </label>
      ) : (
        input
      )}
      {subtext && <span className="AdminCheckbox__subtext">{subtext}</span>}
      {error && <span className="AdminCheckbox__error">{error?.message}</span>}
    </p>
  );
};
