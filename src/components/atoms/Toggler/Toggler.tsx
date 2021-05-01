import classNames from "classnames";
import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";

import "./Toggler.scss";

export interface TogglerProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  title?: string;
  containerClassName?: string;
  togglerClassName?: string;
  titleClassName?: string;
  forwardRef?: (
    value: React.RefObject<HTMLInputElement> | HTMLInputElement | null
  ) => void;
}

export const Toggler: React.FC<TogglerProps> = ({
  title,

  containerClassName,
  togglerClassName,
  titleClassName,

  forwardRef,
  ...extraInputProps
}) => {
  const containerClasses = classNames("Toggler", containerClassName);
  const sliderClasses = classNames("Toggler__slider", togglerClassName);
  const titleClasses = classNames("Toggler__title", titleClassName);

  return (
    <label className={containerClasses}>
      <input
        className="Toggler__native-input"
        hidden
        type="checkbox"
        ref={forwardRef}
        {...extraInputProps}
      />
      <div className={sliderClasses} />
      {title && <div className={titleClasses}>{title}</div>}
    </label>
  );
};
