import React, { ReactNode } from "react";
import {
  FieldErrors,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from "react-hook-form";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";
import { get } from "lodash";

import { ALWAYS_EMPTY_OBJECT } from "settings";

import { AnyForm } from "types/utility";

import * as TW from "./Input.tailwind";

import CN from "./Input.module.scss";

export interface InputProps
  extends Omit<React.HTMLProps<HTMLInputElement>, "label"> {
  name: string;
  subtext?: ReactNode | string;
  register: UseFormRegister<AnyForm>;
  rules?: RegisterOptions;
  description?: ReactNode | string;
  errors?: FieldErrors<FieldValues>;
  hidden?: boolean;
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  name,
  subtext,
  register,
  rules = ALWAYS_EMPTY_OBJECT,
  errors,
  hidden,
  description,
  required,
  label,
  ...inputProps
}) => {
  const error = get(errors, name);

  const parentClasses = classNames("relative", {
    [TW.hidden]: hidden,
  });

  const inputClasses = classNames(TW.input, CN.input, {
    [TW.inputError]: error,
  });
  const hiddenClasses = classNames(parentClasses, inputClasses);

  return hidden ? (
    <input
      {...inputProps}
      {...register(name, rules)}
      className={hiddenClasses}
      name={name}
      type="hidden"
    />
  ) : (
    <div className="Input">
      <div className={parentClasses}>
        {label && (
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        <input
          {...inputProps}
          {...register(name, rules)}
          className={inputClasses}
          name={name}
          aria-invalid={!!error}
        />
        {error && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <FontAwesomeIcon
              icon={faCircleExclamation}
              className="h-5 w-5 text-red-500"
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      {subtext && !error && (
        <span className="mt-2 text-sm text-gray-500">{subtext}</span>
      )}
      {error && <span className={TW.errorMessage}>{error?.message}</span>}
    </div>
  );
};
