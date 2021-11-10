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

import "./ButtonNG.scss";

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

export interface ButtonProps {
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

export const ButtonNG: React.FC<ButtonProps> = ({
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
    "ButtonNG ButtonNG__link": isLink,
    "ButtonNG ButtonNG__button": !isLink,
    "ButtonNG--disabled": disabled,
    "ButtonNG--enabled": !disabled,
    "ButtonNG--loading": loading,
    [`ButtonNG--icon-only ButtonNG--${iconSize}`]: iconOnly,
    [`ButtonNG--icon-text`]: !iconOnly,
    [`ButtonNG--${variant}`]: variant && !disabled,
    [className]: className,
  });

  const iconClasses = classNames({
    "ButtonNG__icon ButtonNG__icon--icon-only": iconOnly,
    "ButtonNG__icon ButtonNG__icon--icon-text": !iconOnly,
  });

  if (loading) {
    return (
      <button className={parentClasses} style={style} type={type} title={title}>
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          size={iconSize}
          className="ButtonNG__icon ButtonNG__icon--loading"
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
