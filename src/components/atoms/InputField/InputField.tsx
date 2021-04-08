import React from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { isTruthy } from "utils/types";
import "./InputField.scss";

export interface InputFieldProps extends React.HTMLProps<HTMLInputElement> {
  iconStart?: IconProp | JSX.Element | false;
  iconEnd?: IconProp | JSX.Element | false;
}

const iconClassNames = (position: string) =>
  classNames("input-field__icon", `input-field__icon--${position}`);

const isJsxElement = (
  component: IconProp | JSX.Element
): component is JSX.Element => {
  return isTruthy(component?.hasOwnProperty("props"));
};

const renderIcon = (
  icon: IconProp | JSX.Element,
  position: string
): JSX.Element => {
  const iconComponent = isJsxElement(icon) ? (
    icon
  ) : (
    <FontAwesomeIcon icon={icon} />
  );

  return <div className={iconClassNames(position)}>{iconComponent}</div>;
};

export const InputField: React.FC<InputFieldProps> = ({
  className,
  iconStart,
  iconEnd,
  ...inputProps
}) => {
  const wrapperClassNames = classNames(
    "input-field",
    {
      "input-field--icon-start": isTruthy(iconStart),
      "input-field--icon-end": isTruthy(iconEnd),
    },
    className
  );

  return (
    <div className={wrapperClassNames}>
      <input className="input-field__input" {...inputProps} />

      {iconStart && renderIcon(iconStart, "start")}
      {iconEnd && renderIcon(iconEnd, "end")}
    </div>
  );
};
