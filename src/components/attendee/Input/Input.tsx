import React from "react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import classNames from "classnames";

import { AnyForm } from "types/utility";

import CN from "./Input.module.scss";

type InputProps = React.HTMLProps<HTMLInputElement> & {
  error?: FieldError;
  onLabelClick?: () => void;
  label?: string;
  name?: string;
  register?: UseFormRegister<AnyForm> | (() => void);
  rules?: RegisterOptions;
  border?: "borderless" | "border";
  variant?: "login" | "overlay" | "overlay-profile" | "overlay-search"; // @debt: there should be a single "overlay" variant
};

export const Input: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputProps
> = ({
  onLabelClick,
  error,
  label,
  register,
  rules,
  name,
  border = "borderless",
  variant = "",
  ...extraInputProps
}) => {
  const inputClassNames = classNames(
    CN.inputField,
    CN[`border-${border}`],
    CN[`variant-${variant}`],
    {
      [CN.invalid]: error,
    }
  );
  const registerProps = name && register ? register(name, rules) : {};

  return (
    <div data-bem="Input" className={CN.input}>
      {label ? (
        <div className={CN.inputWrapper}>
          <label data-label={label} onClick={onLabelClick}>
            <input
              {...registerProps}
              className={inputClassNames}
              {...extraInputProps}
            />
            {error && <span className={CN.errorIcon} />}
          </label>
        </div>
      ) : (
        <div className={CN.inputWrapper}>
          <input
            {...registerProps}
            className={inputClassNames}
            {...extraInputProps}
          />
          {error && <span className={CN.errorIcon} />}
        </div>
      )}
      {error && <span className={CN.inputError}>{error.message}</span>}
    </div>
  );
};
