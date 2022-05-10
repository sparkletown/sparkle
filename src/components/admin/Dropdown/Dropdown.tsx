import { PropsWithChildren, useCallback, useState } from "react";
import { MenuPlacement } from "react-select";
import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  buttonTailwind,
  checkmarkSelected,
  checkmarkTailwind,
  listItem,
  listTailwind,
  optionWrapper,
} from "./Dropdown.tailwind";

import CN from "./Dropdown.module.scss";

export interface Option {
  icon?: string | IconDefinition;
  label: string;
}

interface DropdownProps<T> {
  title?: string;
  className?: string;
  placement?: MenuPlacement;
  noArrow?: boolean;
  options: T[];
  disabled?: boolean;
  renderOption?: (option: T) => JSX.Element;
  onSelect?: (option: T) => void;
}

export const Dropdown = <T extends Option>({
  title,
  options,
  renderOption,
  disabled,
  onSelect,
}: PropsWithChildren<DropdownProps<T>>) => {
  const [isOpened, setOpened] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<Option>();

  const selectOption = useCallback(
    (option) => {
      setSelectedOption(option);
      setOpened(false);
      onSelect?.(option);
    },
    [onSelect]
  );

  return (
    <>
      <button
        onClick={() => setOpened((value) => !value)}
        className={buttonTailwind}
        type="button"
        disabled={disabled}
      >
        {selectedOption?.label ?? title}
        <svg
          className="ml-2 w-4 h-4 self-center"
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
      <div className={`${!isOpened && "hidden"} ${optionWrapper}`}>
        <ul className={listTailwind}>
          {options.map((option, index) => {
            const isSelected =
              option.label === selectedOption?.label ||
              (!selectedOption && !option.label);
            const textContainerClasses = isSelected
              ? "font-semibold select-none relative py-2 pl-3 w-max"
              : "select-none relative py-2 pl-3 w-max";
            const checkmarkClasses = isSelected
              ? `${CN.dropdownSelected} ${checkmarkSelected}`
              : `${CN.dropdownSelected} ${checkmarkTailwind}`;

            return (
              <li
                key={`${index}-${option.label}`}
                className={listItem}
                onClick={() => selectOption(option)}
              >
                {!!renderOption && renderOption(option)}
                {!renderOption && (
                  <>
                    {!!option.icon && (
                      <div className="flex items-center rounded-full w-8 h-8 justify-center bg-sparkle ml-2">
                        {typeof option.icon === "string" && (
                          <img
                            alt={`space-icon-${option.icon}`}
                            src={option.icon}
                            className="w-6 h-6 w-full h-full"
                          />
                        )}
                        {typeof option.icon === "object" && (
                          <FontAwesomeIcon
                            icon={option.icon}
                            className="w-6 h-6 w-full h-full"
                          />
                        )}
                      </div>
                    )}
                    <div className={textContainerClasses}>{option.label}</div>
                    {isSelected && <span className={checkmarkClasses}></span>}
                  </>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};
