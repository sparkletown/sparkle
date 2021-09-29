import React from "react";
import { DropdownButton } from "react-bootstrap";
import classNames from "classnames";

import "./Dropdown.scss";

export interface DropdownProps {
  buttonClassName?: string;
  title: string;
  options: JSX.Element[];
}

// @debt look into the possibility of creating more robust (and isolated) component without Bootstrap
export const Dropdown: React.FC<DropdownProps> = ({
  buttonClassName,
  title,
  options,
}) => (
  <DropdownButton
    title={title}
    className="Dropdown"
    bsPrefix={classNames("Dropdown__button", buttonClassName)}
  >
    {options}
  </DropdownButton>
);
