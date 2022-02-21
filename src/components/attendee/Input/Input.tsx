import React, { forwardRef } from "react";
import { FieldError } from "react-hook-form";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import { isDefined, isTruthy } from "utils/types";

import "./Input.module.scss";

const isJsxElement = (
  component: IconProp | JSX.Element
): component is JSX.Element => {
  return isTruthy(component?.hasOwnProperty("props"));
};

const renderIcon = (
  icon: IconProp | JSX.Element,
  modifiedClassName: string,
  onIconClick: undefined | (() => void)
): JSX.Element => {
  const iconComponent = isJsxElement(icon) ? (
    icon
  ) : (
    <FontAwesomeIcon icon={icon} />
  );

  const iconClasses = classNames("Input__icon", modifiedClassName, {
    "Input__icon--clickable": onIconClick,
  });

  return (
    <div className={iconClasses} onClick={onIconClick}>
      {iconComponent}
    </div>
  );
};

interface InputProps
  extends React.HTMLProps<HTMLInputElement>,
    ContainerClassName {
  inputClassName?: string;
  errorTextClassName?: string;
  iconStartClassName?: string;
  iconEndClassName?: string;
  iconStart?: IconProp | JSX.Element;
  iconEnd?: IconProp | JSX.Element;
  error?: FieldError;
  onIconStartClick?: () => void;
  onIconEndClick?: () => void;
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
    iconStartClassName,
    iconEndClassName,
    errorTextClassName,
    iconStart,
    onIconStartClick,
    iconEnd,
    onIconEndClick,
    onLabelClick,
    error,
    label,
    ...extraInputProps
  },
  ref
) => {
  const containerClassNames = classNames(
    "Input",
    {
      "Input--icon-start": isTruthy(iconStart),
      "Input--icon-end": isTruthy(iconEnd),
      "Input--invalid": isDefined(error),
    },
    containerClassName
  );

  const inputClassNames = classNames("Input__input", inputClassName);

  return (
    <div className={containerClassNames}>
      <div className="Input__wrapper">
        {label ? (
          <label data-label={label} onClick={onLabelClick}>
            <input ref={ref} className={inputClassNames} {...extraInputProps} />
          </label>
        ) : (
          <input ref={ref} className={inputClassNames} {...extraInputProps} />
        )}
        {iconStart &&
          renderIcon(
            iconStart,
            classNames("Input__icon--start", iconStartClassName),
            onIconStartClick
          )}
        {iconEnd &&
          renderIcon(
            iconEnd,
            classNames("Input__icon--end", iconEndClassName),
            onIconEndClick
          )}
      </div>
      {error && (
        <span className={classNames("Input__error", errorTextClassName)}>
          {error.message}
        </span>
      )}
    </div>
  );
};

export const Input = forwardRef(_Input);
