import React from "react";
import classNames from "classnames";

import { getExtraLinkProps } from "utils/url";

import "./CheckboxWrapRF.scss";

export interface CheckboxProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  link?: string;
  isExternal?: boolean;
  label?: string;
  info?: string | boolean | React.ReactElement;
  required?: string | boolean | React.ReactElement;
  error?: string | boolean | React.ReactElement;
}

export const CheckboxWrapRF: React.FC<CheckboxProps> = ({
  className,
  link,
  label,
  isExternal = false,
  info,
  required,
  error,
  children,
}) => {
  const componentClasses = classNames(
    "CheckboxWrapRF mod--flex-col",
    className
  );
  return (
    <div className={componentClasses}>
      <label className="CheckboxWrapRF__label mod--flex-row">
        {children}
        {link ? (
          <a href={link} {...getExtraLinkProps(isExternal)}>
            {label}
          </a>
        ) : (
          label
        )}
      </label>
      {info && <div className="CheckboxWrapRF__info">{info}</div>}
      {required && <div className="CheckboxWrapRF__required">{required}</div>}
      {error && <div className="CheckboxWrapRF__error">{error}</div>}
    </div>
  );
};
