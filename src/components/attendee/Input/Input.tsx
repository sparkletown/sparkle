import React, { RefObject, useMemo } from "react";
import { FieldError, RegisterOptions, UseFormRegister } from "react-hook-form";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ALWAYS_NOOP_FUNCTION } from "settings";

import { AnyForm } from "types/utility";

import { generateId } from "utils/string";
import { isTruthy } from "utils/types";

import { useKeyPress } from "hooks/useKeyPress";

import CN from "./Input.module.scss";

const isJsxElement = (
  component: IconProp | JSX.Element
): component is JSX.Element => {
  return isTruthy(component?.hasOwnProperty("props"));
};

const renderIcon = (
  icon: IconProp | JSX.Element,
  onIconClick: undefined | (() => void)
): JSX.Element => {
  const iconComponent = isJsxElement(icon) ? (
    icon
  ) : (
    <FontAwesomeIcon icon={icon} />
  );

  return <div onClick={onIconClick}>{iconComponent}</div>;
};

const HANDLED_KEY_PRESSES = ["Enter"];

type InputProps = React.HTMLProps<HTMLInputElement> & {
  error?: FieldError;
  onLabelClick?: () => void;
  onEnter?: () => void;
  label?: string;
  subtext?: string;
  name?: string;
  register?: UseFormRegister<AnyForm> | (() => void);
  rules?: RegisterOptions;
  border?: "borderless" | "border";
  variant?: "login" | "overlay" | "chat";
  icon?: IconProp | JSX.Element;
  iconClassName?: string;
  onIconClick?: () => void;
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
  icon,
  iconClassName,
  onIconClick,
  forwardRef,
  subtext,
  ...extraInputProps
}) => {
  const inputId = useMemo(() => generateId("Input"), []);

  const inputClassNames = classNames(
    CN.input,
    CN[`border-${border}`],
    CN[`variant-${variant}`],
    {
      [CN.invalid]: error,
    }
  );

  const wrapperClassNames = classNames(
    CN.inputWrapper,
    CN[`variant-${variant}--wrapper`]
  );

  const registerProps = name && register ? register(name, rules) : {};

  const handleKeyPress = useKeyPress({
    keys: HANDLED_KEY_PRESSES,
    onPress: onEnter,
  });

  return (
    <div data-bem="Input" className={CN.inputContainer}>
      <div className={wrapperClassNames}>
        <input
          id={inputId}
          ref={forwardRef}
          {...registerProps}
          className={inputClassNames}
          {...extraInputProps}
          onKeyDown={handleKeyPress}
        />

        {icon && renderIcon(icon, onIconClick)}

        {label && (
          <label htmlFor={inputId} className={CN.label} onClick={onLabelClick}>
            {label}
          </label>
        )}

        {error && <span className={CN.errorIcon} />}
      </div>

      {!error && subtext && <span>{subtext}</span>}
      {error && <span className={CN.inputError}>{error.message}</span>}
    </div>
  );
};
