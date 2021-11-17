import { useMemo } from "react";

import { DEFAULT_PROFILE_IMAGE } from "settings";

import { BaseUser } from "types/User";

import {
  getFirebaseStorageResizedImage,
  ImageResizeOptions,
} from "utils/image";

export type UserAvatarFields = Pick<BaseUser, "pictureUrl" | "anonMode">;
export type UserAvatarSize = "small" | "medium" | "large" | "xlarge" | "full";

// @debt The avatar sizes are a duplicate of $avatar-sizes-map inside UserAvatar.scss
const AVATAR_SIZE_MAP: { [key in UserAvatarSize]: number | null } = {
  small: 25,
  medium: 40,
  large: 54,
  xlarge: 100,
  full: null,
};

export const useUserAvatar = (
  user?: UserAvatarFields,
  size?: UserAvatarSize
) => {
  return useMemo((): string => {
    const url = user?.anonMode
      ? DEFAULT_PROFILE_IMAGE
      : user?.pictureUrl ?? DEFAULT_PROFILE_IMAGE;

    const facadeSize = size ? AVATAR_SIZE_MAP[size] : undefined;
    const resizeOptions: ImageResizeOptions = { fit: "crop" };
    if (facadeSize) {
      resizeOptions.width = resizeOptions.height = facadeSize;
    }

    return getFirebaseStorageResizedImage(url, resizeOptions);
  }, [user, size]);
};
