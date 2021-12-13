import React, { ReactNode } from "react";
import Select from "react-select/base";

import { ALWAYS_NOOP_FUNCTION } from "settings";

import "./Dropdown.scss";

export interface DropdownProps {
  title: string | ReactNode;
  options?: ReactNode[];
}

// @debt look into the possibility of creating more robust (and isolated) component without Bootstrap
export const Dropdown: React.FC<DropdownProps> = ({
  title,
  options,
  children,
}) => {
  const first = options?.[0];
  const string = typeof first === "string" ? first : "";
  return (
    <>
      {title}
      <Select
        className="Dropdown"
        options={options}
        inputValue={string}
        value={first}
        onChange={ALWAYS_NOOP_FUNCTION}
        onInputChange={ALWAYS_NOOP_FUNCTION}
        onMenuClose={ALWAYS_NOOP_FUNCTION}
        onMenuOpen={ALWAYS_NOOP_FUNCTION}
      />
      {children}
    </>
  );
};
