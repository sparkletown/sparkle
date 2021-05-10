import React from "react";

// Typings
import { ButtonProps } from "./Button.types";

// Styles
import * as S from "./Button.styles";
import { Link } from "react-router-dom";

export const AppButton: React.FC<ButtonProps> = ({
  customClass,
  loading,
  onClick,
  type = "button",
  customStyle,
  children,
  gradient,
  isLink = false,
  linkTo,
}) => {
  if (loading)
    return (
      <div className="spinner-border">
        <span className="sr-only">Loading...</span>
      </div>
    );

  if (isLink) {
    return (
      <S.Button
        as={Link}
        className={customClass}
        style={customStyle}
        to={linkTo!}
      >
        {children}
      </S.Button>
    );
  }

  return (
    <S.Button
      className={customClass}
      style={customStyle}
      type={type}
      onClick={onClick}
      hasGradient={gradient}
    >
      {children}
    </S.Button>
  );
};

export default AppButton;
