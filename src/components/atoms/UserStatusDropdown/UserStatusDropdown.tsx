import React, { useMemo } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

import { USER_STATUSES } from "settings";

import { useProfileStatus } from "hooks/useProfileStatus";

import "./UserStatusDropdown.scss";

export const UserStatusDropdown: React.FC = () => {
  const { status, changeUserStatus } = useProfileStatus();

  const userStatusDropdownOptions = useMemo(
    () =>
      USER_STATUSES.map((option) => (
        <Dropdown.Item key={option} onClick={() => changeUserStatus(option)}>
          {option}
        </Dropdown.Item>
      )),
    [changeUserStatus]
  );

  return (
    // @debt replace with our own dropdown component
    <DropdownButton
      id="user-status-dropdown"
      title={status ?? "Change user status"}
      className="UserStatusDropdown"
    >
      {userStatusDropdownOptions}
    </DropdownButton>
  );
};
