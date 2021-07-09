import React, { useMemo, useEffect } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

import { UserStatus } from "types/User";

import { useProfileStatus } from "hooks/useProfileStatus";

import "./UserStatusDropdown.scss";

export interface UserStatusDropdownProps {
  userStatuses?: UserStatus[];
}

export const UserStatusDropdown: React.FC<UserStatusDropdownProps> = ({
  userStatuses = [],
}) => {
  const { status, changeUserStatus } = useProfileStatus();

  // This will check if the user status from the database exists in the venue user statuses and if it doesn't, it will fallback to the first one from the list.
  useEffect(() => {
    const hasUserStatuses = !!userStatuses.length;

    if (!status || !hasUserStatuses) return;

    const statusTexts = userStatuses.map((userStatus) => userStatus.status);

    const defaultUserStatus = userStatuses[0].status;

    if (!statusTexts.includes(status)) {
      changeUserStatus(defaultUserStatus);
    }
  }, [changeUserStatus, status, userStatuses]);

  const userStatusDropdownOptions = useMemo(
    () =>
      userStatuses.map((userStatus) => (
        <Dropdown.Item
          key={userStatus.status}
          onClick={() => changeUserStatus(userStatus.status)}
        >
          {userStatus.status}
        </Dropdown.Item>
      )),
    [userStatuses, changeUserStatus]
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
