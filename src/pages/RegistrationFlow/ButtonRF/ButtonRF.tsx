import React from "react";
import classNames from "classnames";

import { ButtonNG } from "components/atoms/ButtonNG";
import { ButtonProps } from "components/atoms/ButtonNG/ButtonNG";

import "./ButtonRF.scss";

export const ButtonRF: React.FC<ButtonProps> = ({ className, ...props }) => {
  const componentClasses = classNames("ButtonRF", className);
  return <ButtonNG {...props} className={componentClasses} />;
};
