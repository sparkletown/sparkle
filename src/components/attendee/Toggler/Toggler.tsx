import React from "react";
import classNames from "classnames";

import CN from "./Toggler.module.scss";

export interface TogglerProps {
  toggled?: boolean;
  title?: string;
  onChange?: () => void;
  containerClassName?: string;
  name?: string;
}

export const Toggler: React.FC<TogglerProps> = ({
  toggled,
  title,
  onChange,
  containerClassName,
  name,
  ...extraProps
}) => {
  const containerClasses = classNames(CN.toggler, containerClassName);

  return (
    <div className={containerClasses}>
      <label className={CN.switch}>
        <input
          type="checkbox"
          name={name}
          onChange={onChange}
          checked={toggled}
          {...extraProps}
        />
        <span className={`${CN.slider} ${CN.sliderRound}`}></span>
      </label>
      {title && <label>{title}</label>}
    </div>
  );
};
