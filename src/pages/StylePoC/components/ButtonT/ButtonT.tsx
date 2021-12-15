import React, { CSSProperties, useCallback, useMemo } from "react";
import { Link, useHistory } from "react-router-dom";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleNotch } from "@fortawesome/free-solid-svg-icons/faCircleNotch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import {
  externalUrlAdditionalProps,
  getExtraLinkProps,
  resolveUrlPath,
} from "utils/url";

const TW_MARGINS = "m-3";
const TW_PRIMARY = `inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`;
const TW_SECONDARY = `inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`;

export type ButtonType = "button" | "reset" | "submit";
export type ButtonVariant =
  | "primary"
  | "secondary"
  | "white"
  | "dark"
  | "danger"
  | "admin-gradient"
  | "danger-gradient"
  | "normal-gradient"
  | "login-gradient"
  | "login-primary"
  | "login-outline";

export type ButtonIconSize = "1x" | "2x" | "3x";

export interface ButtonTProps {
  className?: string;
  style?: CSSProperties;
  disabled?: boolean;
  onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  isLink?: boolean;
  linkTo?: string;
  newTab?: boolean;
  loading?: boolean;
  type?: ButtonType;
  variant?: ButtonVariant;
  iconOnly?: boolean;
  iconName?: IconProp;
  iconSize?: ButtonIconSize;
  title?: string;
}

export const ButtonT: React.FC<ButtonTProps> = ({
  children,
  className = "",
  style,
  loading,
  onClick,
  type = "button",
  isLink = false,
  linkTo = "",
  disabled = false,
  newTab = false,
  variant = "",
  iconOnly = false,
  iconName,
  iconSize = "1x",
  title,
}) => {
  const history = useHistory();

  const handleClick = useCallback(() => {
    if (disabled) return;

    if (linkTo) {
      if (newTab) {
        window.open(
          linkTo,
          externalUrlAdditionalProps.target,
          externalUrlAdditionalProps.rel
        );
      } else history.push(linkTo);
    }

    // NOTE: with both linkTo/onClick, this serves as callback e.g. to show modal popup after opening new window
    onClick?.();
  }, [onClick, linkTo, newTab, disabled, history]);

  const resolvedUrl = useMemo(() => linkTo && resolveUrlPath(linkTo), [linkTo]);

  const parentClasses = classNames({
    [className]: className,
    ButtonT: true,
    ButtonT__link: isLink,
    ButtonT__button: !isLink,
    "ButtonT--disabled": disabled,
    "ButtonT--enabled": !disabled,
    "ButtonT--loading": loading,
    "ButtonT--icon-only": iconOnly,
    [`ButtonT--${iconSize}`]: iconOnly,
    "ButtonT--icon-text": !iconOnly,
    [`ButtonT--${variant}`]: variant && !disabled,
    [TW_MARGINS]: true,
    [TW_SECONDARY]: variant !== "primary" && variant !== "danger" && !disabled,
    [TW_PRIMARY]: variant === "primary" && !disabled,
    "btn-save": variant === "danger" && !disabled,
  });

  const iconClasses = classNames({
    ButtonT__icon: true,
    "ButtonT__icon--icon-only": iconOnly,
    "ButtonT__icon--icon-text": !iconOnly,
  });

  if (loading) {
    return (
      <button className={parentClasses} style={style} type={type} title={title}>
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          size={iconSize}
          className={classNames("ButtonT__icon", "ButtonT__icon--loading")}
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
      onClick={handleClick}
      disabled={disabled}
      title={title ?? resolvedUrl}
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
