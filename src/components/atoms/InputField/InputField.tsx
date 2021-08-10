import React, { forwardRef } from "react";
import { FieldError } from "react-hook-form";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { isDefined, isTruthy } from "utils/types";

import "./InputField.scss";

const isJsxElement = (
  component: IconProp | JSX.Element
): component is JSX.Element => {
  return isTruthy(component?.hasOwnProperty("props"));
};

const renderIcon = (
  icon: IconProp | JSX.Element,
  modifiedClassName: string
): JSX.Element => {
  const iconComponent = isJsxElement(icon) ? (
    icon
  ) : (
    <FontAwesomeIcon icon={icon} />
  );

  return (
    <div className={classNames("InputField__icon", modifiedClassName)}>
      {iconComponent}
    </div>
  );
};

interface InputFieldProps
  extends React.HTMLProps<HTMLInputElement>,
    ContainerClassName {
  inputClassName?: string;
  errorTextClassName?: string;
  iconStartClassName?: string;
  iconEndClassName?: string;
  iconStart?: IconProp | JSX.Element;
  iconEnd?: IconProp | JSX.Element;
  error?: FieldError;
}

export const _InputField: React.ForwardRefRenderFunction<
  HTMLInputElement,
  InputFieldProps
> = (
  {
    containerClassName,
    inputClassName,
    iconStartClassName,
    iconEndClassName,
    errorTextClassName,
    iconStart,
    iconEnd,
    error,
    ...extraInputProps
  },
  ref
) => {
  const containerClassNames = classNames(
    "InputField",
    {
      "InputField--icon-start": isTruthy(iconStart),
      "InputField--icon-end": isTruthy(iconEnd),
      "InputField--invalid": isDefined(error),
    },
    containerClassName
  );

  const inputClassNames = classNames("InputField__input", inputClassName);

  return (
    <div className={containerClassNames}>
      <div>
        <input ref={ref} className={inputClassNames} {...extraInputProps} />

        {iconStart &&
          renderIcon(
            iconStart,
            classNames("InputField__icon--start", iconStartClassName)
          )}
        {iconEnd &&
          renderIcon(
            iconEnd,
            classNames("InputField__icon--end", iconEndClassName)
          )}
      </div>
      {error && (
        <span className={classNames("InputField__error", errorTextClassName)}>
          {error.message}
        </span>
      )}
    </div>
  );
};

export const InputField = forwardRef(_InputField);
