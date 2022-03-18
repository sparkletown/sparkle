import React, { AnchorHTMLAttributes, DetailedHTMLProps } from "react";
import classNames from "classnames";

import { externalUrlAdditionalProps, reloadUrlAdditionalProps } from "utils/url";

import "./LinkButton.scss";

export interface LinkButtonProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  href: string;
  isBlank: boolean;
}

// @deprecated Use ButtonNG instead
export const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  href,
  className,
  isBlank,
  ...extraProps
}) => {
  const linkClasses = classNames("LinkButton", className);
  const linkBehaviorProps = isBlank ? externalUrlAdditionalProps : reloadUrlAdditionalProps;

  return (
    <a
      className={linkClasses}
      href={href}
      {...extraProps}
      {...linkBehaviorProps}
    >
      {children}
    </a>
  );
};
