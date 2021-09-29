import React from "react";
import { DropdownButton } from "react-bootstrap";

import "./Dropdown.scss";

export interface DropdownProps {
  title: string;
  options: JSX.Element[];
}

export const Dropdown: React.FC<DropdownProps> = ({ title, options }) => {
  return (
    <DropdownButton title={title} className="Dropdown">
      {options}
    </DropdownButton>
  );
};
