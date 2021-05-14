import React, { useState } from "react";
import { Experience, Statuses } from "types/User";

import "./UserStatusDropdown.scss";

export interface UserStatusDropdownProps {
  options: Array<Statuses>;
  onChange: (option: string) => void;
  label: string | Experience;
}

export const UserStatusDropdown: React.FC<UserStatusDropdownProps> = ({
  options,
  label,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggling = () => {
    setIsOpen(!isOpen);
  };

  const onOptionClicked = (value: string) => () => {
    onChange(value);
    setIsOpen(false);
  };

  const optionsComponents = options
    .filter((opt) => opt !== label)
    .map((option) => (
      <li
        className="dropdown-container__item"
        onClick={onOptionClicked(option)}
        key={option}
      >
        {option}
      </li>
    ));

  return (
    <div className="dropdown-container">
      <div className="dropdown-container__header" onClick={toggling}>
        {label}
      </div>
      {isOpen && (
        <div className="dropdown-container__list-container">
          <ul className="dropdown-container__list">{optionsComponents}</ul>
        </div>
      )}
    </div>
  );
};
