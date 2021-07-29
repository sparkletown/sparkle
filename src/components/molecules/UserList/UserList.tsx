import React from "react";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";

import { User } from "types/User";
import { ContainerClassName } from "../../../types/utility";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";
import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./UserList.scss";
import { useMemo } from "react";

const noop = () => {};

interface UserListProps extends ContainerClassName {
  users: readonly WithId<User>[];
  limit?: number;
  activity?: string;
  cellClassName?: string;
  hasClickableAvatars?: boolean;
  showEvenWhenNoUsers?: boolean;
  showMoreUsersToggler?: boolean;
  showTitle?: boolean;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  limit,
  activity = "partying",
  containerClassName,
  cellClassName,
  hasClickableAvatars = false,
  showEvenWhenNoUsers = false,
  showMoreUsersToggler = true,
  showTitle = true,
}) => {
  const { isShown: isExpanded, toggle: toggleExpanded } = useShowHide(false);

  const usersSanitized = users.filter(
    (user) => !user.anonMode && user.partyName && user.id
  );

  const usersToDisplay = isExpanded
    ? usersSanitized
    : usersSanitized?.slice(0, limit);

  const userCount = usersSanitized.length;

  const hasExcessiveUserCount = limit !== undefined && userCount > limit;

  const label = `${userCount} ${
    userCount === 1 ? "person" : "people"
  } ${activity}`;

  const containerClasses = classNames("UserList", containerClassName);
  const cellClasses = classNames("UserList__cell", cellClassName);

  const { openUserProfileModal } = useProfileModalControls();

  const renderedUserAvatars = useMemo(
    () =>
      usersToDisplay.map((user) => (
        <div key={user.id} className={cellClasses}>
          <UserAvatar
            user={user}
            containerClassName="UserList__avatar"
            onClick={
              hasClickableAvatars ? () => openUserProfileModal(user) : noop
            }
          />
        </div>
      )),
    [usersToDisplay, cellClasses, hasClickableAvatars, openUserProfileModal]
  );

  if (!showEvenWhenNoUsers && userCount < 1) return null;

  return (
    <div className={containerClasses}>
      <div className="UserList__label">
        {showTitle && <p>{label}</p>}

        {showMoreUsersToggler && hasExcessiveUserCount && (
          <p className="UserList__toggler-text" onClick={toggleExpanded}>
            See {isExpanded ? "less" : "all"}
          </p>
        )}
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
