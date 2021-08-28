import React from "react";
import classNames from "classnames";

import "./InputWrapRF.scss";

export interface TextInputProps {
  className?: string;
  info?: string | boolean | React.ReactElement;
  required?: string | boolean | React.ReactElement;
  error?: string | boolean | React.ReactElement;
}

export const InputWrapRF: React.FC<TextInputProps> = ({
  children,
  className = "",
  info,
  required,
  error,
}) => {
  const componentClasses = classNames({
    "InputWrapRF InputWrapRF__group mod--flex-col": true,
    "InputWrapRF--error": required || error,
    [className]: className,
  });
  console.log(InputWrapRF.name, componentClasses, { info, required, error });
  return (
    <div className={componentClasses}>
      {children}
      {info && <div className="InputWrapRF__info">{info}</div>}
      {required && <div className="InputWrapRF__required">{required}</div>}
      {error && <div className="InputWrapRF__error">{error}</div>}
    </div>
  );
};
