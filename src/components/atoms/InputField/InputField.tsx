import React, { ChangeEvent } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import "./InputField.scss";

export interface InputFieldProps {
  className?: string;
  icon?: IconProp;
  onChange?: (e?: ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  autoComplete?: string;
  placeholder?: string;
  iconPosition?: "right" | "left";
}

const ICON_INPUT_CLASS_NAME = "input-field";
const ICON_CLASS_NAME = `${ICON_INPUT_CLASS_NAME}__icon`;
const INPUT_CLASS_NAME = `${ICON_INPUT_CLASS_NAME}__input`;

export const InputField: React.FC<InputFieldProps> = ({
  className,
  icon,
  onChange,
  value,
  autoComplete = "off",
  placeholder,
  iconPosition = "left",
}) => {
  const wrapperClassNames = classNames(ICON_INPUT_CLASS_NAME, className);
  const iconClassNames = classNames(
    ICON_CLASS_NAME,
    iconPosition === "right" && `${ICON_CLASS_NAME}--right`
  );
  const inputClassNames = classNames(
    INPUT_CLASS_NAME,
    `${INPUT_CLASS_NAME}--icon-from-${iconPosition}`
  );

  return (
    <div className={wrapperClassNames}>
      <input
        className={inputClassNames}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
      />

      {icon && (
        <div className={iconClassNames}>
          <FontAwesomeIcon icon={icon} />
        </div>
      )}
    </div>
  );
};
