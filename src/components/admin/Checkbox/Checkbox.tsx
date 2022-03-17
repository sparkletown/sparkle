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
  ml?: string;
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
  ml,
  ...inputProps
}) => {
  const error = get(errors, name);

  return (
    <fieldset
      className={`Checkbox mb-7 mt-4 ${ml && `ml-${ml}`}`}
      tabIndex={tabIndex}
    >
      <div className="relative flex items-start">
        <div className="flex items-center h-5">
          <input
            {...inputProps}
            className="AdminCheckbox__input checked:bg-blue-500 indeterminate:bg-gray-300 focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
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
