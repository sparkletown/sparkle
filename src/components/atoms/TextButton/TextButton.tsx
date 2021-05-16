import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import classNames from "classnames";

import "./TextButton.scss";

export interface TextButtonProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  label: string;
  containerClassName?: string;
}

export const TextButton: React.FC<TextButtonProps> = ({
  text,
  containerClassName,
  ...props
}) => {
  const containerClasses = classNames("TextButton", containerClassName);

  return (
    <button className={containerClasses} {...props}>
      {text}
    </button>
  );
};
