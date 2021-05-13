import React from "react";
import classNames from "classnames";

import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";

import { User } from "types/User";

import { WithId } from "utils/id";

import "./UserAvatar.scss";

export interface UserAvatarProps {
  user?: WithId<User>;
  containerClassName?: string;
  imageClassName?: string;
  isShowStatus?: boolean;
  onClick?: () => void;
}

// @debt the UserProfilePicture component serves a very similar purpose to this, we should unify them as much as possible
export const UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  containerClassName,
  imageClassName,
  onClick,
  isShowStatus,
}) => {
  const avatarSrc: string = user?.anonMode
    ? DEFAULT_PROFILE_IMAGE
    : user?.pictureUrl ?? DEFAULT_PROFILE_IMAGE;

  const userDisplayName: string = user?.anonMode
    ? DEFAULT_PARTY_NAME
    : user?.partyName ?? DEFAULT_PARTY_NAME;

  const containerClasses = classNames("user-avatar", containerClassName, {
    "user-avatar--clickable": onClick !== undefined,
  });

  const status = user?.data?.status || "";

  const imageClasses = classNames("user-avatar__image", imageClassName);
  const statusClasses = classNames("user-avatar__status-dot", {
    [`user-avatar__status-dot_${status}`]: status,
  });

  return (
    <div className={containerClasses}>
      <img
        className={imageClasses}
        src={avatarSrc}
        alt={`${userDisplayName}'s avatar`}
        onClick={onClick}
      />
      {isShowStatus && status && <span className={statusClasses} />}
    </div>
  );
};
