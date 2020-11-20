import React, { ChangeEvent, FC, useCallback } from "react";

interface NavSearchBarInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const NavSearchBarInput: FC<NavSearchBarInputProps> = ({
  value,
  onChange,
}) => {
  const handleOnChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(e.target.value);
    },
    [onChange]
  );

  return (
    <input
      className="nav-search-input"
      type="text"
      name=""
      value={value}
      onChange={handleOnChange}
      placeholder="Search for people, rooms, events..."
    />
  );
};
