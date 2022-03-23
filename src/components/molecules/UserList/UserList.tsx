import React, { useMemo } from "react";
import classNames from "classnames";

import { UserId } from "types/id";
import { User } from "types/User";

import { WithId } from "utils/id";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./UserList.scss";

const noop = () => {};

interface UserListProps {
  usersSample: readonly WithId<User>[];
  userCount: number;
  activity?: string;
  cellClassName?: string;
  hasClickableAvatars?: boolean;
  showEvenWhenNoUsers?: boolean;
  showTitle?: boolean;
  attendeesTitle?: string;
}

export const UserList: React.FC<UserListProps> = ({
  usersSample,
  userCount,
  activity = "partying",
  cellClassName,
  hasClickableAvatars = false,
  showEvenWhenNoUsers = false,
  showTitle = true,
  attendeesTitle,
}) => {
  const excessiveUserCount =
    userCount - usersSample.length > 0 ? userCount - usersSample.length : 0;

  const label = `${userCount} ${
    attendeesTitle ?? (userCount === 1 ? "person" : "people")
  } ${activity}`;

  const cellClasses = classNames("UserList__cell", cellClassName);

  const { openUserProfileModal } = useProfileModalControls();

  const renderedUserAvatars = useMemo(
    () =>
      usersSample.map((user) => (
        <div key={user.id} className={cellClasses}>
          <UserAvatar
            user={user}
            containerClassName="UserList__avatar"
            onClick={
              hasClickableAvatars
                ? () => openUserProfileModal(user.id as UserId)
                : noop
            }
          />
        </div>
      )),
    [usersSample, cellClasses, hasClickableAvatars, openUserProfileModal]
  );

  if (!showEvenWhenNoUsers && userCount < 1) return null;

  return (
    <div data-bem="UserList">
      <div data-bem="UserList__label">
        {showTitle && <p data-bem="UserList__label-text">{label}</p>}
      </div>

      <div data-bem="UserList__avatars">
        {renderedUserAvatars}
        {excessiveUserCount > 0 && (
          <div data-bem="UserList__excessive-number">
            and {excessiveUserCount} more
          </div>
        )}
      </div>
    </div>
  );
};
