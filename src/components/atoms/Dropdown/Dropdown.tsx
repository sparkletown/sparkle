import React from "react";
import { DropdownButton } from "react-bootstrap";
import classNames from "classnames";

import { ContainerClassName } from "types/utility";

import "./Dropdown.scss";

export interface DropdownProps extends ContainerClassName {
  id: string;
  title: string;
  options: JSX.Element[];
}

export const Dropdown: React.FC<DropdownProps> = ({
  containerClassName,
  id,
  title,
  options,
}) => {
  return (
    <DropdownButton
      id={id}
      title={title}
      className={classNames("Dropdown", containerClassName)}
    >
      {options}
    </DropdownButton>
  );
};
