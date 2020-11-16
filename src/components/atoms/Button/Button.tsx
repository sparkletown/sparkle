import React from "react";

// Typings
import { ButtonProps } from "./Button.types";

// Styles
import * as S from "./Button.styles";

const AppButton: React.FC<ButtonProps> = ({
  customClass,
  loading,
  onClick,
  text,
  type,
  customStyle,
}) => {
  if (loading)
    return (
      <div className="spinner-border">
        <span className="sr-only">Loading...</span>
      </div>
    );

  return (
    <S.Button
      className={customClass}
      style={customStyle}
      type={type}
      onClick={onClick}
    >
      {text}
    </S.Button>
  );
};

AppButton.defaultProps = {
  type: "button",
};

export default AppButton;
