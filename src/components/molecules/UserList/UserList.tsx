import React from "react";
import classNames from "classnames";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useShowHide } from "hooks/useShowHide";

import { UserProfilePicture } from "components/molecules/UserProfilePicture";

import "./UserList.scss";

interface UserListProps {
  users: readonly WithId<User>[];
  limit?: number;
  activity?: string;
  containerClassName?: string;
  avatarClassName?: string;
  isAudioEffectDisabled?: boolean;
  showEvenWhenNoUsers?: boolean;
  showTitle?: boolean;
}

export const UserList: React.FC<UserListProps> = ({
  users,
  limit,
  activity = "partying",
  containerClassName,
  avatarClassName,
  isAudioEffectDisabled,
  showEvenWhenNoUsers = false,
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
  const avatarClasses = classNames("UserList__avatar", avatarClassName);

  if (!showEvenWhenNoUsers && userCount < 1) return null;

  return (
    <div className={containerClasses}>
      <div className="UserList__label">
        {showTitle && <p>{label}</p>}

        {hasExcessiveUserCount && (
          <p className="clickable-text" onClick={toggleExpanded}>
            See {isExpanded ? "less" : "all"}
          </p>
        )}
      </div>

      <div className="UserList__avatars">
        {usersToDisplay.map((user) => (
          <UserProfilePicture
            user={user}
            isAudioEffectDisabled={isAudioEffectDisabled}
            key={user.id}
            containerClassName={avatarClasses}
          />
        ))}
      </div>
    </div>
  );
};

/** @deprecated use named export instead **/
export default UserList;
