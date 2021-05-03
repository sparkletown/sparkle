import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

import "./Checkbox.scss";

export interface CheckboxProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  title?: string;
  toggler?: boolean;
  containerClassName?: string;
  titleClassName?: string;
  forwardRef?: (
    value: React.RefObject<HTMLInputElement> | HTMLInputElement | null
  ) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  title,

  toggler: isToggler = false,

  containerClassName,
  titleClassName,

  forwardRef,
  ...extraInputProps
}) => {
  const containerClasses = classNames("Checkbox", containerClassName);
  const checkboxClasses = classNames("Checkbox__custom-input", {
    "Checkbox__custom-input--toggler": isToggler,
  });
  const titleClasses = classNames("Checkbox__title", titleClassName);

  return (
    <label className={containerClasses}>
      <input
        className="Checkbox__native-input"
        hidden
        type="checkbox"
        ref={forwardRef}
        {...extraInputProps}
      />
      <div className={checkboxClasses}>
        <FontAwesomeIcon
          icon={faCheck}
          size="sm"
          className="Checkbox__tick-icon"
        />
      </div>
      {title && <div className={titleClasses}>{title}</div>}
    </label>
  );
};
