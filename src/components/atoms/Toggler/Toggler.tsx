import React from "react";
import classNames from "classnames";

import "./Toggler.scss";

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
  const containerClasses = classNames("Toggler", containerClassName);
  return (
    <div className={containerClasses}>
      <label className="switch">
        <input
          type="checkbox"
          checked={toggled}
          name={name}
          onClick={onChange}
          {...extraProps}
        />
        <span className="slider round"></span>
      </label>
      {title && <label>{title}</label>}
    </div>
  );
};
