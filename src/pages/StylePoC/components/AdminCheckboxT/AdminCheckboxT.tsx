import React, { ReactNode } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import classNames from "classnames";
import { get } from "lodash";

import { CheckboxProps } from "components/atoms/Checkbox";

const TW_WRAP = "flex items-center h-5";
const TW_INPUT =
  "focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded";

export interface AdminCheckboxTProps
  extends Omit<CheckboxProps, "label" | "toggler" | "flip-switch"> {
  className?: string;
  errors?: FieldErrors<FieldValues>;
  label?: ReactNode | string;
  labelPosition?: "before" | "after" | "above";
  name: string;
  displayOn?: ReactNode | string;
  displayOff?: ReactNode | string;
  register: (Ref: unknown, RegisterOptions?: unknown) => void;
  subtext?: ReactNode | string;
  variant?: "toggler" | "checkbox" | "flip-switch";
}

export const AdminCheckboxT: React.FC<AdminCheckboxTProps> = ({
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
    [className]: className,
    AdminCheckboxT: true,
    "AdminCheckboxT--disabled": disabled,
    "AdminCheckboxT--enabled": !disabled,
    [`AdminCheckboxT--${variant}`]: variant,
    [`AdminCheckboxT--label-${labelPosition}`]: labelPosition,
  });

  const input = (
    <span className="AdminCheckboxT__flip-wrapper relative flex items-start">
      {variant === "flip-switch" && (
        <span className="AdminCheckboxT__off">{displayOff}</span>
      )}
      {/* NOTE: must always have label around input and the following span for the click to be shared */}
      {/* NOTE: multiple labels per input are OK, so keep this one empty of any text, use surrounding label for it */}
      <label className={classNames("AdminCheckboxT__input-wrapper", TW_WRAP)}>
        <input
          {...inputProps}
          className={classNames("AdminCheckboxT__input", TW_INPUT)}
          type="checkbox"
          hidden
          disabled={disabled}
          name={name}
          ref={register}
        />
      </label>
      {variant === "flip-switch" && (
        <span className={"AdminCheckboxT__on"}>{displayOn}</span>
      )}
    </span>
  );

  return (
    <p className={parentClasses} tabIndex={tabIndex}>
      {label ? (
        <label className="AdminCheckboxT__label font-medium text-gray-700">
          {(labelPosition === "before" || labelPosition === "above") && (
            <span className={"AdminCheckboxT__label-wrapper"}>{label}</span>
          )}

          {input}

          {labelPosition === "after" && (
            <span className="AdminCheckboxT__label-wrapper ml-3 text-sm">
              {label}
            </span>
          )}
        </label>
      ) : (
        input
      )}
      {subtext && <span className={"AdminCheckboxT__subtext"}>{subtext}</span>}
      {error && (
        <span className={"AdminCheckboxT__error"}>{error?.message}</span>
      )}
    </p>
  );
};
