import React from "react";
import { FieldError, UseFormRegister } from "react-hook-form";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ALWAYS_EMPTY_OBJECT } from "settings";

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
  modifiedClassName: string,
  onIconClick: undefined | (() => void)
): JSX.Element => {
  const iconComponent = isJsxElement(icon) ? (
    icon
  ) : (
    <FontAwesomeIcon icon={icon} />
  );

  const iconClasses = classNames("InputField__icon", modifiedClassName, {
    "InputField__icon--clickable": onIconClick,
  });

  return (
    <div className={iconClasses} onClick={onIconClick}>
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
  onIconStartClick?: () => void;
  onIconEndClick?: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: UseFormRegister<any> | (() => void);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  rules?: Record<string, any>;
  name?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  containerClassName,
  inputClassName,
  iconStartClassName,
  iconEndClassName,
  errorTextClassName,
  iconStart,
  onIconStartClick,
  iconEnd,
  onIconEndClick,
  error,
  register,
  rules = ALWAYS_EMPTY_OBJECT,
  name = "",
  ...extraInputProps
}) => {
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
      <div className="InputField__wrapper">
        <input
          className={inputClassNames}
          {...register(name, rules)}
          {...extraInputProps}
        />

        {iconStart &&
          renderIcon(
            iconStart,
            classNames("InputField__icon--start", iconStartClassName),
            onIconStartClick
          )}
        {iconEnd &&
          renderIcon(
            iconEnd,
            classNames("InputField__icon--end", iconEndClassName),
            onIconEndClick
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
