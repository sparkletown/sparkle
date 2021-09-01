import React, { AriaRole, CSSProperties } from "react";
import { Link } from "react-router-dom";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { getExtraLinkProps } from "utils/url";

import "./ButtonNG.scss";

export type ButtonGradientType =
  | "gradient"
  | "admin-gradient"
  | "danger-gradient";

export type ButtonType = "button" | "reset" | "submit";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "white"
  | "dark"
  | "seethrough";

export type ButtonIconSize = "1x" | "2x" | "3x";

export interface ButtonProps {
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  isLink?: boolean;
  linkTo?: string;
  newTab?: boolean;
  loading?: boolean;
  gradient?: ButtonGradientType;
  type?: ButtonType;
  variant?: ButtonVariant;
  iconOnly?: boolean;
  iconName?: IconProp;
  iconSize?: ButtonIconSize;
  title?: string;
  role?: AriaRole;
}

export const ButtonNG: React.FC<ButtonProps> = ({
  children,
  className = "",
  style,
  loading,
  onClick,
  type = "button",
  gradient = "",
  isLink = false,
  linkTo = "#",
  disabled = false,
  newTab = false,
  variant = "",
  iconOnly = false,
  iconName,
  iconSize = "1x",
  title,
  role,
  ...extraProps
}) => {
  const parentClasses = classNames({
    "ButtonNG ButtonNG__link": isLink,
    "ButtonNG ButtonNG__button": !isLink,
    "ButtonNG--disabled": disabled,
    "ButtonNG--enabled": !disabled,
    "ButtonNG--loading": loading,
    [`ButtonNG--icon-only ButtonNG--${iconSize}`]: iconOnly,
    [`ButtonNG--icon-text`]: !iconOnly,
    [`ButtonNG--${gradient}`]: gradient && !disabled,
    [`ButtonNG--${variant}`]: variant && !disabled,
    [className]: className,
  });

  const iconClasses = classNames({
    "ButtonNG__icon ButtonNG__icon--icon-only": iconOnly,
    "ButtonNG__icon ButtonNG__icon--icon-text": !iconOnly,
  });

  if (loading) {
    return (
      <button
        className={parentClasses}
        style={style}
        type={type}
        title={title}
        role={role}
        {...extraProps}
      >
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          size={iconSize}
          className="ButtonNG__icon"
        />
      </button>
    );
  }

  if (isLink) {
    return (
      <Link
        className={parentClasses}
        style={style}
        to={disabled ? "#" : linkTo}
        {...getExtraLinkProps(newTab && !disabled)}
        title={title}
        onClick={() => onClick?.()}
        {...extraProps}
      >
        {iconName && (
          <FontAwesomeIcon
            icon={iconName}
            size={iconSize}
            className={iconClasses}
          />
        )}
        {children}
      </Link>
    );
  }

  return (
    <button
      className={parentClasses}
      style={style}
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      role={role}
      {...extraProps}
    >
      {iconName && (
        <FontAwesomeIcon
          icon={iconName}
          size={iconSize}
          className={iconClasses}
        />
      )}
      {children}
    </button>
  );
};
