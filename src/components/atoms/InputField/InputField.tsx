import React from "react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ALWAYS_EMPTY_OBJECT } from "settings";

import { AnyForm, ContainerClassName } from "types/utility";

import { isDefined, isTruthy } from "utils/types";

import styles from "./InputField.module.scss";

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
  register: UseFormRegister<AnyForm> | (() => void);
  rules?: RegisterOptions;
  name?: string;
}

/**
 * @deprecated Please use the appropriate attendee or admin Input
 * @see src/components/admin/Input
 * @see src/components/attendee/Input
 */
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
      <div className={styles.inputFieldWrapper}>
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
            classNames(styles.iconEnd, iconEndClassName),
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
