import React, { ReactNode } from "react";
import Select, { MenuPlacement, MenuPosition } from "react-select";

import "./Dropdown.scss";

export interface DropdownProps {
  title: { value: string; label: ReactNode };
  options: { value: string; label: ReactNode }[];
  className?: string;
  placement?: MenuPlacement;
  noArrow?: boolean;
}

// @debt look into the possibility of creating more robust (and isolated) component without Bootstrap
export const Dropdown: React.FC<DropdownProps> = ({
  title,
  options,
  className,
  placement,
  noArrow,
}) => {
  const styles = {
    indicatorSeparator: () => ({ display: "none" }),
    control: () => ({
      background: "transparent",
      border: "none",
      borderRadius: "20px",
      boxShadow: "none",
      outline: "none",
      display: "flex",
    }),
    input: () => ({ display: "none" }),
    singleValue: () => ({ color: "white" }),
    option: () => ({
      display: "flex",
      alignitems: "center",
      textDecoration: "none",
      fontSize: "14px",
      lineHeight: "17px",
      padding: "0px",
      cursor: "pointer",
    }),
    menu: () => ({
      borderRadius: "20px",
      maxHeight: "240px",
      position: "absolute" as MenuPosition,
      top: "45px",
      overflow: "auto",
      cursor: "default",
    }),
    menuList: () => ({ maxHeight: "240px" }),
    dropdownIndicator: () => ({ ...(noArrow && { display: "none" }) }),
  };

  return (
    <Select
      value={title}
      className={className || "Dropdown"}
      classNamePrefix="Dropdown__button"
      options={options}
      placeholder={title}
      styles={styles}
      menuPlacement={placement}
    />
  );
};
