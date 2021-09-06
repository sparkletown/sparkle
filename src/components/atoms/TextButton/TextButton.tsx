import React, { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import "./TextButton.scss";

export interface TextButtonProps
  extends DetailedHTMLProps<
      ButtonHTMLAttributes<HTMLButtonElement>,
      HTMLButtonElement
    >,
    ContainerClassName {
  label: string;
}

export const TextButton: React.FC<TextButtonProps> = ({
  label,
  containerClassName,
  ...props
}) => {
  const containerClasses = classNames("TextButton", containerClassName);

  return (
    <button className={containerClasses} {...props}>
      {label}
    </button>
  );
};
