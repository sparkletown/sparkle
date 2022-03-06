import React from "react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import classNames from "classnames";

import { AnyForm, ContainerClassName } from "types/utility";

import CN from "./Input.module.scss";

interface InputProps
  extends React.HTMLProps<HTMLInputElement>,
    ContainerClassName {
  inputClassName?: string;
  error?: FieldError;
  onLabelClick?: () => void;
  label?: string;
  name?: string;
  register?: UseFormRegister<AnyForm> | (() => void);
  rules?: RegisterOptions;
}

export const Input: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputProps
> = ({
  containerClassName,
  inputClassName,
  onLabelClick,
  error,
  label,
  register,
  rules,
  name,
  ...extraInputProps
}) => {
  const inputClassNames = classNames(CN.inputField, inputClassName);
  const registerProps = name && register ? register(name, rules) : {};

  return (
    <div className={CN.input}>
      {label ? (
        <label data-label={label} onClick={onLabelClick}>
          <input
            {...registerProps}
            className={inputClassNames}
            {...extraInputProps}
          />
        </label>
      ) : (
        <input
          {...registerProps}
          className={inputClassNames}
          {...extraInputProps}
        />
      )}
      {error && <span className={CN.inputError}>{error.message}</span>}
    </div>
  );
};
