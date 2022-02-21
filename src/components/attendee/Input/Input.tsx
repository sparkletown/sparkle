import React, { forwardRef } from "react";
import { FieldError } from "react-hook-form";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import CN from "./Input.module.scss";

interface InputProps
  extends React.HTMLProps<HTMLInputElement>,
    ContainerClassName {
  inputClassName?: string;
  error?: FieldError;
  onLabelClick?: () => void;
  label?: string;
}

export const _Input: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputProps
> = (
  {
    containerClassName,
    inputClassName,
    onLabelClick,
    error,
    label,
    ...extraInputProps
  },
  ref
) => {
  const inputClassNames = classNames(CN.inputField, inputClassName);

  return (
    <div className={CN.input}>
      {label ? (
        <label data-label={label} onClick={onLabelClick}>
          <input ref={ref} className={inputClassNames} {...extraInputProps} />
        </label>
      ) : (
        <input ref={ref} className={inputClassNames} {...extraInputProps} />
      )}
      {error && <span className={CN.inputError}>{error.message}</span>}
    </div>
  );
};

export const Input = forwardRef(_Input);
