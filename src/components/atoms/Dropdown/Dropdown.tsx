import React from "react";
import { DropdownButton } from "react-bootstrap";

import "./Dropdown.scss";

export interface DropdownProps {
  title: string;
  options: JSX.Element[];
}

// @debt look into the possibility of creating more robust (and isolated) component without Bootstrap
export const Dropdown: React.FC<DropdownProps> = ({ title, options }) => (
  <DropdownButton title={title} className="Dropdown">
    {options}
  </DropdownButton>
);
