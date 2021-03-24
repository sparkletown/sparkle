import React, { ChangeEvent, FC, useCallback } from "react";

interface UserSearchBarInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const UserSearchBarInput: FC<UserSearchBarInputProps> = ({
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
      className="user-search-input"
      type="text"
      name=""
      value={value}
      onChange={handleOnChange}
      placeholder="Search for people"
      autoComplete="off"
    />
  );
};
