import React, { useCallback, useMemo } from "react";
import classNames from "classnames";
import { MiniProfile } from "components/attendee/MiniProfile";
import { isEqual } from "lodash";

import { DEFAULT_PARTY_NAME } from "settings";

import { ElementId, UserId } from "types/id";
import { Profile } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";
import {
  determineAvatar,
  getFirebaseStorageResizedImage,
  ImageResizeOptions,
} from "utils/image";
import { generateId } from "utils/string";

import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useProfileModalControls } from "hooks/useProfileModalControls";

import { UserAvatarStatus } from "./UserStatus";

import CN from "./UserAvatar.module.scss";

export type UserAvatarSize = "small" | "medium" | "large" | "xlarge" | "full";

export type UserAvatarUserFields = WithId<
  Pick<Profile, "partyName" | "pictureUrl" | "anonMode" | "status">
>;

export interface UserAvatarProps extends ContainerClassName {
  user?: UserAvatarUserFields;
  imageClassName?: string;
  showStatus?: boolean;
  onClick?: () => void;
  size?: UserAvatarSize;
  clickable?: boolean;
}

// @debt The avatar sizes are a duplicate of $avatar-sizes-map inside UserAvatar.module.scss
const AVATAR_SIZE_MAP: { [key in UserAvatarSize]: number | null } = {
  small: 25,
  medium: 42,
  large: 54,
  xlarge: 100,
  full: null,
};

// @debt the UserProfilePicture component serves a very similar purpose to this, we should unify them as much as possible
export const _UserAvatar: React.FC<UserAvatarProps> = ({
  user,
  containerClassName,
  imageClassName,
  clickable = true,
  showStatus,
  size,
}) => {
  const elementId = useMemo(() => generateId("UserAvatar-") as ElementId, []);

  const { worldSlug } = useSpaceParams();
  const { src: imageSrc, onError: onImageLoadError } = useMemo(
    () => determineAvatar({ user }),
    [user]
  );

  const avatarSrc = useMemo((): string => {
    const facadeSize = size ? AVATAR_SIZE_MAP[size] : undefined;
    const resizeOptions: ImageResizeOptions = { fit: "crop" };
    if (facadeSize) {
      resizeOptions.width = resizeOptions.height = facadeSize;
    }

    return getFirebaseStorageResizedImage(imageSrc, resizeOptions);
  }, [size, imageSrc]);

  const userDisplayName: string = user?.partyName ?? DEFAULT_PARTY_NAME;

  const sizeStyleName = `avatarContainer__${size}`;

  const containerClasses = classNames(
    CN.avatarContainer,
    size && CN[sizeStyleName],
    containerClassName
  );

  const imageClasses = classNames(CN.userAvatar, imageClassName);

  const {
    hasSelectedProfile,
    openUserProfileModal,
    closeUserProfileModal,
    selectedElementId,
  } = useProfileModalControls();

  const onClick = useCallback(() => {
    if (!clickable) return;

    if (hasSelectedProfile && selectedElementId === elementId) {
      closeUserProfileModal();
    } else {
      openUserProfileModal(user?.id as UserId, elementId);
    }
  }, [
    clickable,
    closeUserProfileModal,
    elementId,
    hasSelectedProfile,
    openUserProfileModal,
    selectedElementId,
    user?.id,
  ]);

  return (
    <div className={containerClasses}>
      <img
        className={imageClasses}
        src={avatarSrc}
        alt={`${userDisplayName}'s avatar`}
        onClick={onClick}
        onError={onImageLoadError}
      />

      {worldSlug && (
        <UserAvatarStatus user={user} size={size} showStatus={showStatus} />
      )}

      {clickable && <MiniProfile parentComponent={elementId} />}
    </div>
  );
};

export const UserAvatar = React.memo(_UserAvatar, isEqual);
