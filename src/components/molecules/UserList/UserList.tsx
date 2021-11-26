import React, { useMemo } from "react";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./UserList.scss";

const noop = () => {};

interface UserListProps extends ContainerClassName {
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
  containerClassName,
  cellClassName,
  hasClickableAvatars = false,
  showEvenWhenNoUsers = false,
  showTitle = true,
  attendeesTitle,
}) => {
  const hasExcessiveUserCount = userCount > usersSample.length;

  const label = `${userCount} ${
    attendeesTitle ?? (userCount === 1 ? "person" : "people")
  } ${activity}`;

  const containerClasses = classNames("UserList", containerClassName);
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
              hasClickableAvatars ? () => openUserProfileModal(user.id) : noop
            }
          />
        </div>
      )),
    [usersSample, cellClasses, hasClickableAvatars, openUserProfileModal]
  );

  if (!showEvenWhenNoUsers && userCount < 1) return null;

  return (
    <div className={containerClasses}>
      <div className="UserList__label">
        {showTitle && <p className="UserList__label-text">{label}</p>}
      </div>

      <div className="UserList__avatars">
        {renderedUserAvatars}
        {hasExcessiveUserCount && (
          <div className={cellClasses}>
            <FontAwesomeIcon
              icon={faEllipsisH}
              size="xs"
              className="UserList__dots-icon"
            />
          </div>
        )}
      </div>
    </div>
  );
};
