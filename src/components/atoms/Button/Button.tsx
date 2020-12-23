// @ts-nocheck
import React from "react";

// Typings
import { ButtonProps } from "./Button.types";

// Styles
import * as S from "./Button.styles";
import { Link } from "react-router-dom";

const AppButton: React.FC<ButtonProps> = ({
  customClass,
  loading,
  onClick,
  text,
  type,
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
        // hasGradient={gradient}
        to={linkTo!}
      >
        {children ?? text}
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
      {children ?? text}
    </S.Button>
  );
};

AppButton.defaultProps = {
  type: "button",
};

export default AppButton;
