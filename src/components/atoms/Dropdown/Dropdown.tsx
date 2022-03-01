import React, { ReactElement, ReactNode } from "react";
import Select, { MenuPlacement } from "react-select";

import {
  ALWAYS_EMPTY_ARRAY,
  ALWAYS_EMPTY_SELECT_OPTION,
  ALWAYS_NO_STYLE_FUNCTION,
} from "settings";

import "./Dropdown.scss";

// if these are undefined, the 3rd party library will provide own defaults
const NO_INLINE_STYLES_PLEASE = {
  menu: ALWAYS_NO_STYLE_FUNCTION,
  input: ALWAYS_NO_STYLE_FUNCTION,
  option: ALWAYS_NO_STYLE_FUNCTION,
  control: ALWAYS_NO_STYLE_FUNCTION,
  menuList: ALWAYS_NO_STYLE_FUNCTION,
  container: ALWAYS_NO_STYLE_FUNCTION,
  singleValue: ALWAYS_NO_STYLE_FUNCTION,
  valueContainer: ALWAYS_NO_STYLE_FUNCTION,
  inputContainer: ALWAYS_NO_STYLE_FUNCTION,
  dropdownIndicator: ALWAYS_NO_STYLE_FUNCTION,
  indicatorSeparator: ALWAYS_NO_STYLE_FUNCTION,
  indicatorsContainer: ALWAYS_NO_STYLE_FUNCTION,
};
Object.freeze(NO_INLINE_STYLES_PLEASE);

const DROPDOWN_VALUE_PROP = "data-dropdown-value";
type DropdownItemProps = { [DROPDOWN_VALUE_PROP]?: string };

const remap: (label: ReactNode) => { label: ReactNode; value: string } = (
  reactNode
) => {
  if (null === reactNode || undefined === reactNode || "" === reactNode) {
    return ALWAYS_EMPTY_SELECT_OPTION;
  }

  const type = typeof reactNode;

  return type === "string" || type === "number" || type === "boolean"
    ? { label: reactNode, value: String(reactNode) }
    : {
        label: reactNode,
        value:
          (reactNode as ReactElement<DropdownItemProps>).props[
            DROPDOWN_VALUE_PROP
          ] ?? "",
      };
};

interface DropdownProps {
  title?: ReactNode;
  className?: string;
  placement?: MenuPlacement;
  noArrow?: boolean;
}

export const Dropdown: React.FC<DropdownProps> = ({ title, children }) => {
  const value = remap(title);
  const options = React.Children.map(children, remap) ?? ALWAYS_EMPTY_ARRAY;

  return (
    <Select
      className={
        "z-10 w-44 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600"
      }
      value={value}
      placeholder={value}
      options={options}
    />
  );
};
