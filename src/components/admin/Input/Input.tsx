import React, { ReactNode } from "react";
import {
  FieldError,
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
  // @debt we should use `errors` property, unless it's a nested validation object (see example in the ProfileModalEditLink)
  // @see the conversation https://github.com/sparkletown/sparkle/pull/2931#discussion_r832017043
  error?: FieldError;
  hidden?: boolean;
  label?: string;
}

export const Input: React.FC<InputProps> = ({
  name,
  subtext,
  register,
  rules = ALWAYS_EMPTY_OBJECT,
  errors,
  error: errorProp,
  hidden,
  description,
  required,
  label,
  ...inputProps
}) => {
  const error = get(errors, name) ?? errorProp;

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
    <div data-bem="Input">
      <div className={parentClasses}>
        {label && (
          <div className="block text-sm font-medium text-gray-700">{label}</div>
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
