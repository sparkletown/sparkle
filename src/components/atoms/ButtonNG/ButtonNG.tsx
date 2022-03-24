import React, {
  ButtonHTMLAttributes,
  CSSProperties,
  RefObject,
  useCallback,
  useMemo,
} from "react";
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

import styles from "./ButtonNG.module.scss";

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

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
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
  forwardRef?: RefObject<HTMLButtonElement>;
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
  forwardRef,
  ...extraParams
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

  const variantClassnameMap: Record<string, string> = {
    primary: styles.buttonPrimary,
    secondary: styles.buttonSecondary,
  };
  const variantStyle = variantClassnameMap[variant];

  const parentClasses = classNames(!disabled && variantStyle, {
    [className]: className,
    "ButtonNG ButtonNG__link": isLink,
    "ButtonNG ButtonNG__button": !isLink,
    [styles.buttonDisabled]: disabled,
    "ButtonNG--enabled": !disabled,
    "ButtonNG--loading": loading,
    [`ButtonNG--icon-only ButtonNG--${iconSize}`]: iconOnly,
    [`ButtonNG--icon-text`]: !iconOnly,
  });

  const iconClasses = classNames({
    "ButtonNG__icon ButtonNG__icon--icon-only": iconOnly,
    "ButtonNG__icon ButtonNG__icon--icon-text": !iconOnly,
  });

  if (loading) {
    return (
      <button
        data-bem="ButtonNG"
        ref={forwardRef}
        className={parentClasses}
        style={style}
        type={type}
        title={title}
        {...extraParams}
      >
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
        data-bem="ButtonNG"
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
      data-bem="ButtonNG"
      className={parentClasses}
      style={style}
      type={type}
      ref={forwardRef}
      onClick={handleClick}
      disabled={disabled}
      title={title ?? resolvedUrl}
      {...extraParams}
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
