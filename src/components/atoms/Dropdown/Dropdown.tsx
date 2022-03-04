import React, { ReactElement, ReactNode, useState } from "react";
import { MenuPlacement } from "react-select";

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
  onSelect?: (option: Option) => void;
}

export type Option = {
  label: ReactNode;
  value: string;
};

export const Dropdown: React.FC<DropdownProps> = ({
  title,
  children,
  onSelect,
}) => {
  const [isOpened, setOpened] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option>();

  const options = React.Children.map(children, remap) ?? ALWAYS_EMPTY_ARRAY;

  const selectOption = (option: Option) => {
    setSelectedOption(option);
    setOpened(false);
    onSelect?.(option);
  };

  return (
    <>
      <button
        onClick={() => setOpened((value) => !value)}
        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center inline-flex items-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        type="button"
      >
        {selectedOption?.label ?? title}
        <svg
          className="ml-2 w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>
      <div
        className={`${
          !isOpened && "hidden"
        } absolute z-10 w-44 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700`}
      >
        <ul className="py-1">
          {options.map((option) => (
            <li key={option.value}>
              <div
                className="block py-2 px-4 text-sm  hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                onClick={() => selectOption(option)}
              >
                {option.label}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};
