import React, { useMemo } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

import { USER_STATUSES } from "settings";

import { useProfileStatus } from "hooks/useProfileStatus";

import { UserStatus } from "types/User";

import "./UserStatusDropdown.scss";

export interface UserStatusDropdownProps {
  userStatuses?: UserStatus[];
}

export const UserStatusDropdown: React.FC<UserStatusDropdownProps> = ({
  userStatuses,
}) => {
  const { status, changeUserStatus } = useProfileStatus();

  const allUserStatuses = useMemo(
    () => (userStatuses ? [...USER_STATUSES, ...userStatuses] : USER_STATUSES),
    [userStatuses]
  );

  const userStatusDropdownOptions = useMemo(
    () =>
      allUserStatuses.map((userStatus) => (
        <Dropdown.Item
          key={userStatus.status}
          onClick={() => changeUserStatus(userStatus.status)}
        >
          {userStatus.status}
        </Dropdown.Item>
      )),
    [allUserStatuses, changeUserStatus]
  );

  return (
    // @debt replace with our own dropdown component
    <DropdownButton
      id="user-status-dropdown"
      title={status ?? "change status"}
      className="UserStatusDropdown"
    >
      {userStatusDropdownOptions}
    </DropdownButton>
  );
};
