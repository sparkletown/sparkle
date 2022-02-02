import React, { ReactNode } from "react";
import Select, { MenuPlacement } from "react-select";
import classNames from "classnames";

import { ALWAYS_NO_STYLE_FUNCTION } from "settings";

import "./Dropdown.scss";

const NO_INLINE_STYLES_PLEASE = {
  menu: ALWAYS_NO_STYLE_FUNCTION,
  option: ALWAYS_NO_STYLE_FUNCTION,
  control: ALWAYS_NO_STYLE_FUNCTION,
  menuList: ALWAYS_NO_STYLE_FUNCTION,
  singleValue: ALWAYS_NO_STYLE_FUNCTION,
  dropdownIndicator: ALWAYS_NO_STYLE_FUNCTION,
  indicatorSeparator: ALWAYS_NO_STYLE_FUNCTION,
};
Object.freeze(NO_INLINE_STYLES_PLEASE);

interface DropdownProps {
  title: { value: string; label: ReactNode };
  options: { value: string; label: ReactNode }[];
  className?: string;
  placement?: MenuPlacement;
  noArrow?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({
  title,
  options,
  className,
  placement,
  noArrow,
}) => (
  <Select
    className={classNames(
      className,
      "Dropdown",
      noArrow ? "Dropdown--arrowless" : "Dropdown--arrowful"
    )}
    classNamePrefix="Select"
    value={title}
    options={options}
    placeholder={title}
    menuPlacement={placement}
    styles={NO_INLINE_STYLES_PLEASE}
  />
);
