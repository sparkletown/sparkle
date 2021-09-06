import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import "./Checkbox.scss";

export interface CheckboxProps
  extends DetailedHTMLProps<
      InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    ContainerClassName {
  label?: string;
  toggler?: boolean;
  labelClassName?: string;
  forwardedRef?: (
    value: React.RefObject<HTMLInputElement> | HTMLInputElement | null
  ) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  label,

  toggler: isToggler = false,

  containerClassName,
  labelClassName,

  forwardedRef,
  ...extraInputProps
}) => {
  const containerClasses = classNames("Checkbox", containerClassName);
  const checkboxClasses = classNames("Checkbox__custom-input", {
    "Checkbox__custom-input--toggler": isToggler,
  });
  const labelClasses = classNames("Checkbox__label", labelClassName);

  return (
    <label className={containerClasses}>
      <input
        className="Checkbox__native-input"
        hidden
        type="checkbox"
        ref={forwardedRef}
        {...extraInputProps}
      />
      <div className={checkboxClasses}>
        <FontAwesomeIcon
          icon={faCheck}
          size="sm"
          className="Checkbox__tick-icon"
        />
      </div>
      {label && <div className={labelClasses}>{label}</div>}
    </label>
  );
};
