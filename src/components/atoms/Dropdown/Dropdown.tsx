import React, { ReactNode } from "react";
import { DropdownButton } from "react-bootstrap";

import "./Dropdown.scss";

export interface DropdownProps {
  title: string | ReactNode;
  options: ReactNode[];
}

// @debt look into the possibility of creating more robust (and isolated) component without Bootstrap
export const Dropdown: React.FC<DropdownProps> = ({ title, options }) => (
  <DropdownButton
    title={title}
    className="Dropdown"
    bsPrefix="Dropdown__button"
  >
    {options}
  </DropdownButton>
);
