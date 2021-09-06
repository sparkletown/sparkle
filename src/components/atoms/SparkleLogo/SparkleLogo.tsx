import React from "react";
import classNames from "classnames";

import logo from "assets/icons/sparkle-nav-logo.png";
import textLogo from "assets/icons/sparkle-nav-logo-text.png";

import "./SparkleLogo.scss";

export interface SparkleLogoProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  small?: boolean;
}

export const SparkleLogo: React.FC<SparkleLogoProps> = ({
  small,
  className,
  ...extraProps
}) => {
  const logoClasses = classNames("SparkleLogo", className, {
    "SparkleLogo--small": small,
  });

  return (
    <div className={logoClasses} {...extraProps}>
      <img className="SparkleLogo__icon" src={logo} alt="icon" />
      <img className="SparkleLogo__icon-text" src={textLogo} alt="sparkle" />
    </div>
  );
};
