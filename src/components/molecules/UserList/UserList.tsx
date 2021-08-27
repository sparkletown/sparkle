import React, { useCallback, useMemo } from "react";
import { faEllipsisH } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useProfileModalControls } from "hooks/useProfileModalControls";
import { useShowHide } from "hooks/useShowHide";

import { UserAvatar } from "components/atoms/UserAvatar";

import "./UserList.scss";

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

  const onClickUserAvatar = useCallback(
    (e: React.MouseEvent, user: WithId<User>) => {
      if (!hasClickableAvatars) return;

      e.stopPropagation();
      openUserProfileModal(user);
    },
    [hasClickableAvatars, openUserProfileModal]
  );

  const onClickShowMore = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleExpanded();
    },
    [toggleExpanded]
  );

  const renderedUserAvatars = useMemo(
    () =>
      usersToDisplay.map((user) => (
        <div key={user.id} className={cellClasses}>
          <UserAvatar
            user={user}
            containerClassName="UserList__avatar"
            onClick={(e) => onClickUserAvatar(e, user)}
          />
        </div>
      )),
    [usersToDisplay, cellClasses, onClickUserAvatar]
  );

  if (!showEvenWhenNoUsers && userCount < 1) return null;

  return (
    <div className={containerClasses}>
      <div className="UserList__label">
        {showTitle && <p>{label}</p>}

        {showMoreUsersToggler && hasExcessiveUserCount && (
          <p className="UserList__toggler-text" onClick={onClickShowMore}>
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
