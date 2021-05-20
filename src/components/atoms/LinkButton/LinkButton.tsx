import React, { DetailedHTMLProps, AnchorHTMLAttributes } from "react";
import classNames from "classnames";
import { externalUrlAdditionalProps } from "utils/url";

import "./LinkButton.scss";

export interface LinkButtonProps
  extends DetailedHTMLProps<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    HTMLAnchorElement
  > {
  href: string;
}

export const LinkButton: React.FC<LinkButtonProps> = ({
  children,
  href,
  className,
  ...extraProps
}) => {
  const linkClasses = classNames("LinkButton", className);

  return (
    <a
      href={href}
      {...extraProps}
      {...externalUrlAdditionalProps}
      className={linkClasses}
    >
      {children}
    </a>
  );
};
