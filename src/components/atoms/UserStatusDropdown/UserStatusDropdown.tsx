import React, { useCallback, useMemo } from "react";

import { UserStatus } from "types/User";

import { useShowHide } from "hooks/useShowHide";

import "./UserStatusDropdown.scss";

export interface UserStatusDropdownProps {
  options: UserStatus[];
  onChange: (option: UserStatus | null) => void;
  label?: string;
}

export const UserStatusDropdown: React.FC<UserStatusDropdownProps> = ({
  options,
  label,
  onChange,
}) => {
  const {
    isShown: isDropdownOptionsShown,
    hide: hideDropdownOptions,
    toggle: toggleDropdownOptions,
  } = useShowHide();

  const onOptionClicked = useCallback(
    (value: UserStatus) => {
      if (value === "online") {
        onChange(null);
      }
      onChange(value);
      hideDropdownOptions();
    },
    [hideDropdownOptions, onChange]
  );

  const optionsComponents = useMemo(() => {
    return options
      .filter((opt) => opt !== label)
      .map((option) => (
        <li
          className="Dropdown__item"
          onClick={() => onOptionClicked(option)}
          key={option}
        >
          {option}
        </li>
      ));
  }, [label, onOptionClicked, options]);

  return (
    <div className="Dropdown">
      <div className="Dropdown__header" onClick={toggleDropdownOptions}>
        {label || "change status"}
      </div>
      {isDropdownOptionsShown && (
        <div className="Dropdown__list-container">
          <ul className="Dropdown__list">{optionsComponents}</ul>
        </div>
      )}
    </div>
  );
};
