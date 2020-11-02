import React from "react";

// Typings
import { ButtonProps } from "./Button.types";

const Button: React.FC<ButtonProps> = ({
  customClass,
  loading,
  onClick,
  text,
  type,
}) => {
  if (loading)
    return (
      <div className="spinner-border">
        <span className="sr-only">Loading...</span>
      </div>
    );

  return (
    <button
      className={`btn btn-primary ${customClass}`}
      type={type}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

Button.defaultProps = {
  type: "button",
};

export default Button;
