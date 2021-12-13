import React, { useEffect, useMemo } from "react";
import classNames from "classnames";

import { UserStatus } from "types/User";
import { ContainerClassName } from "types/utility";

import { useVenueUserStatuses } from "hooks/useVenueUserStatuses";

import { Dropdown } from "components/atoms/Dropdown";

import "./UserStatusDropdown.scss";

export interface UserStatusDropdownProps extends ContainerClassName {
  userStatuses: UserStatus[];
  showDropdown?: boolean;
}

export const UserStatusDropdown: React.FC<UserStatusDropdownProps> = ({
  userStatuses,
  showDropdown,
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
        <div
          className="UserStatusDropdown__item"
          key={userStatus.status}
          onClick={() => changeUserStatus(userStatus.status)}
        >
          {userStatus.status}
        </div>
      )),
    [userStatuses, changeUserStatus]
  );

  return (
    // @debt align the style of the SpacesDropdown with the Dropdown component
    <div className={classNames("UserStatusDropdown", containerClassName)}>
      <div className="UserStatusDropdown__status">
        {userStatus.status}&nbsp;
      </div>
      {showDropdown && (
        <Dropdown title="change status" options={userStatusDropdownOptions} />
      )}
    </div>
  );
};
