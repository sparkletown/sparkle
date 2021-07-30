import React, { useMemo, useEffect } from "react";
import { Dropdown, DropdownButton } from "react-bootstrap";

import { UserStatus } from "types/User";

import { useVenueUserStatuses } from "hooks/useVenueUserStatuses";

import "./UserStatusDropdown.scss";
import { ContainerClassName } from "../../../types/utility";
import classNames from "classnames";

export interface UserStatusDropdownProps extends ContainerClassName {
  userStatuses: UserStatus[];
}

export const UserStatusDropdown: React.FC<UserStatusDropdownProps> = ({
  userStatuses,
  containerClassName,
}) => {
  const { userStatus, changeUserStatus } = useVenueUserStatuses();

  // This will check if the user status from the database exists in the venue user statuses and if it doesn't, it will fallback to the first one from the list.
  useEffect(() => {
    const statusTexts = userStatuses.map((userStatus) => userStatus.status);

    const defaultUserStatus = userStatuses[0].status;

    if (!statusTexts.includes(userStatus.status)) {
      changeUserStatus(defaultUserStatus);
    }
  }, [changeUserStatus, userStatus, userStatuses]);

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
      title={userStatus.status ?? "change status"}
      className={classNames("UserStatusDropdown", containerClassName)}
    >
      {userStatusDropdownOptions}
    </DropdownButton>
  );
};
