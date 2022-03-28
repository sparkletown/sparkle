import React, { useEffect, useMemo } from "react";
import { Dropdown } from "components/admin/Dropdown";

import { STRING_NON_BREAKING_SPACE } from "settings";

import { UserStatus } from "types/User";

import { useVenueUserStatuses } from "hooks/useVenueUserStatuses";

export interface UserStatusDropdownProps {
  userStatuses: UserStatus[];
  showDropdown?: boolean;
}

export const UserStatusDropdown: React.FC<UserStatusDropdownProps> = ({
  userStatuses,
  showDropdown,
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
      userStatuses.map((userStatus, index) => (
        <div
          className="UserStatusDropdown__item"
          key={`${index}-${userStatus.status}`}
          onClick={() => changeUserStatus(userStatus.status)}
          data-dropdown-value={userStatus.status}
        >
          {userStatus.status}
        </div>
      )),
    [userStatuses, changeUserStatus]
  );

  return (
    <div data-bem="UserStatusDropdown" className="flex">
      <div data-bem="UserStatusDropdown__status">
        {userStatus.status}
        {STRING_NON_BREAKING_SPACE}
      </div>

      {showDropdown && (
        <Dropdown title="change status" noArrow>
          {userStatusDropdownOptions}
        </Dropdown>
      )}
    </div>
  );
};
