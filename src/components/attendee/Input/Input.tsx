import React, { RefObject, useMemo } from "react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import classNames from "classnames";

import { ALWAYS_NOOP_FUNCTION } from "settings";

import { AnyForm } from "types/utility";

import { generateId } from "utils/string";

import { useKeyPress } from "hooks/useKeyPress";

import CN from "./Input.module.scss";

const HANDLED_KEY_PRESSES = ["Enter"];

type InputProps = React.HTMLProps<HTMLInputElement> & {
  error?: FieldError;
  onLabelClick?: () => void;
  onEnter?: () => void;
  label?: string;
  name?: string;
  register?: UseFormRegister<AnyForm> | (() => void);
  rules?: RegisterOptions;
  border?: "borderless" | "border";
  variant?: "login" | "overlay";
  forwardRef?: RefObject<HTMLInputElement>;
};

export const Input: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputProps
> = ({
  onLabelClick,
  onEnter = ALWAYS_NOOP_FUNCTION,
  error,
  label,
  register,
  rules,
  name,
  border = "borderless",
  variant = "",
  forwardRef,
  ...extraInputProps
}) => {
  const inputId = useMemo(() => generateId("Input"), []);

  const inputClassNames = classNames(
    CN.inputField,
    CN[`border-${border}`],
    CN[`variant-${variant}`],
    {
      [CN.invalid]: error,
    }
  );
  const registerProps = name && register ? register(name, rules) : {};

  const handleKeyPress = useKeyPress({
    keys: HANDLED_KEY_PRESSES,
    onPress: onEnter,
  });

  return (
    <div data-bem="Input" className={CN.input}>
      <div className={CN.inputWrapper}>
        <input
          id={inputId}
          {...registerProps}
          className={inputClassNames}
          {...extraInputProps}
          onKeyDown={handleKeyPress}
          ref={forwardRef}
        />

        {label && (
          <label htmlFor={inputId} className={CN.label} onClick={onLabelClick}>
            {label}
          </label>
        )}

        {error && <span className={CN.errorIcon} />}
      </div>

      {error && <span className={CN.inputError}>{error.message}</span>}
    </div>
  );
};
