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

import { generateClassNameGetter } from "../../util";

import CN from "./ButtonM.module.scss";

const cn = generateClassNameGetter(CN);

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

export interface ButtonMProps {
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

export const ButtonM: React.FC<ButtonMProps> = ({
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
    [cn("ButtonM")]: true,
    [cn("ButtonM__link")]: isLink,
    [cn("ButtonM__button")]: !isLink,
    [cn("ButtonM--disabled")]: disabled,
    [cn("ButtonM--enabled")]: !disabled,
    [cn("ButtonM--loading")]: loading,
    [cn("ButtonM--icon-only")]: iconOnly,
    [cn(`ButtonM--${iconSize}`)]: iconOnly,
    [cn("ButtonM--icon-text")]: !iconOnly,
    [cn(`ButtonM--${variant}`)]: variant && !disabled,
  });

  const iconClasses = classNames(CN.icon, {
    [cn("ButtonM__icon")]: true,
    [cn("ButtonM__icon--icon-only")]: iconOnly,
    [cn("ButtonM__icon--icon-text")]: !iconOnly,
  });

  if (loading) {
    return (
      <button className={parentClasses} style={style} type={type} title={title}>
        <FontAwesomeIcon
          icon={faCircleNotch}
          spin
          size={iconSize}
          className={classNames(
            cn("ButtonM__icon"),
            cn("ButtonM__icon--loading")
          )}
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
