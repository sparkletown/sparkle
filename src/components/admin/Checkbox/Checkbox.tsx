import React, { ReactNode } from "react";
import { FieldErrors, FieldValues, UseFormRegister } from "react-hook-form";
import { get } from "lodash";

import { AnyForm } from "types/utility";

import * as TW from "./Checkbox.tailwind";

export interface CheckboxProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "label"> {
  errors?: FieldErrors<FieldValues>;
  label?: ReactNode | string;
  name: string;
  displayOn?: ReactNode | string;
  displayOff?: ReactNode | string;
  register: UseFormRegister<AnyForm>;
  subtext?: ReactNode | string;
  variant?: "toggler" | "checkbox" | "flip-switch";
}

export const Checkbox: React.FC<CheckboxProps> = ({
  disabled,
  errors,
  label,
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

  return (
    <fieldset data-bem="Checkbox" className="mb-4 mt-4" tabIndex={tabIndex}>
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            {...inputProps}
            data-bem="AdminCheckbox__input"
            className={TW.checkbox}
            disabled={disabled}
            type="checkbox"
            {...register(name)}
          />
        </div>
        <div className="ml-3 text-sm">
          <label htmlFor="comments" className="font-medium text-gray-700">
            {label}
          </label>
        </div>
      </div>

      {subtext && !error && <span className={TW.subtext}>{subtext}</span>}
      {error && <span className={TW.errorMessage}>{error?.message}</span>}
    </fieldset>
  );
};
