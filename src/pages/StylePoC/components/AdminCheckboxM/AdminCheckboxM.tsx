import React, { ReactNode } from "react";
import { FieldErrors, FieldValues } from "react-hook-form";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { get } from "lodash";

import { generateClassNameGetter } from "pages/StylePoC/util";

import { CheckboxProps } from "components/atoms/Checkbox";

import CN from "./AdminCheckboxM.module.scss";

const cn = generateClassNameGetter(CN);

export interface AdminCheckboxMProps
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

export const AdminCheckboxM: React.FC<AdminCheckboxMProps> = ({
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
    [cn("AdminCheckboxM")]: true,
    [cn("AdminCheckboxM--disabled")]: disabled,
    [cn("AdminCheckboxM--enabled")]: !disabled,
    [cn(`AdminCheckboxM--${variant}`)]: variant,
    [cn(`AdminCheckboxM--label-${labelPosition}`)]: labelPosition,
  });

  const input = (
    <span className={cn("AdminCheckboxM__flip-wrapper")}>
      {variant === "flip-switch" && (
        <span className={cn("AdminCheckboxM__off")}>{displayOff}</span>
      )}
      {/* NOTE: must always have label around input and the following span for the click to be shared */}
      {/* NOTE: multiple labels per input are OK, so keep this one empty of any text, use surrounding label for it */}
      <label className={cn("AdminCheckboxM__input-wrapper")}>
        <input
          {...inputProps}
          className={cn("AdminCheckboxM__input")}
          type="checkbox"
          hidden
          disabled={disabled}
          name={name}
          ref={register}
        />
        <span className={cn("AdminCheckboxM__box")}>
          <FontAwesomeIcon
            className={cn("AdminCheckboxM__tick")}
            icon={faCheck}
            size="sm"
          />
        </span>
      </label>
      {variant === "flip-switch" && (
        <span className={cn("AdminCheckboxM__on")}>{displayOn}</span>
      )}
    </span>
  );

  return (
    <p className={parentClasses} tabIndex={tabIndex}>
      {label ? (
        <label className={cn("AdminCheckboxM__label")}>
          {(labelPosition === "before" || labelPosition === "above") && (
            <span className={cn("AdminCheckboxM__label-wrapper")}>{label}</span>
          )}

          {input}

          {labelPosition === "after" && (
            <span className={cn("AdminCheckboxM__label-wrapper")}>{label}</span>
          )}
        </label>
      ) : (
        input
      )}
      {subtext && (
        <span className={cn("AdminCheckboxM__subtext")}>{subtext}</span>
      )}
      {error && (
        <span className={cn("AdminCheckboxM__error")}>{error?.message}</span>
      )}
    </p>
  );
};
