import React, { useCallback, useMemo } from "react";

import { UserStatus } from "types/User";

import { useShowHide } from "hooks/useShowHide";

import "./UserStatusDropdown.scss";

export interface UserStatusDropdownProps {
  options: UserStatus[];
  onChange: (option: UserStatus) => void;
  label: UserStatus | string;
}

export const UserStatusDropdown: React.FC<UserStatusDropdownProps> = ({
  options,
  label,
  onChange,
}) => {
  const { isShown: isDropdownOptionsShown, hideDropdownOptions, toggle: toggleDropdownOptions } = useShowHide();

  const onOptionClicked = useCallback(
    (value: UserStatus) => {
      onChange(value);
      hide();
    },
    [hide, onChange]
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
      <div className="Dropdown__header" onClick={toggle}>
        {label || "change status"}
      </div>
      {isShown && (
        <div className="Dropdown__list-container">
          <ul className="Dropdown__list">{optionsComponents}</ul>
        </div>
      )}
    </div>
  );
};
