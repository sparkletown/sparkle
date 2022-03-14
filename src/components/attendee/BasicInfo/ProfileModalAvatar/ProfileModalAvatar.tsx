import React, { useCallback, useMemo, useRef, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { useAsyncFn } from "react-use";
import classNames from "classnames";

import { ACCEPTED_IMAGE_TYPES } from "settings";

import { UserProfileModalFormData } from "types/profileModal";
import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useUploadProfilePictureHandler } from "hooks/useUploadProfilePictureHandler";
import { useUser } from "hooks/useUser";

import { ImageOverlay } from "components/atoms/ImageOverlay";
import { UserAvatar } from "components/atoms/UserAvatar";

import "firebase/storage";

import styles from "./ProfileModalAvatar.module.scss";

export interface ProfileModalAvatarProps extends ContainerClassName {
  user: WithId<User>;
  editMode?: boolean;
  setPictureUrl?: (url: string) => void;
  pictureUrl?: string;
  register?: UseFormRegister<UserProfileModalFormData>;
}

export const ProfileModalAvatar: React.FC<ProfileModalAvatarProps> = ({
  editMode,
  user,
  register,
  pictureUrl,
  setPictureUrl,
  containerClassName,
}: ProfileModalAvatarProps) => {
  const uploadRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const { userId } = useUser();
  const uploadProfilePictureHandler = useUploadProfilePictureHandler(
    setError,
    userId
  );

  const [uploadingState, handleFileChange] = useAsyncFn(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const pictureUrlRef = await uploadProfilePictureHandler(e);
      if (pictureUrlRef && setPictureUrl) {
        setPictureUrl(pictureUrlRef);
      }
    },
    [uploadProfilePictureHandler, setPictureUrl]
  );

  const uploadProfilePic = useCallback((event) => {
    event.preventDefault();
    uploadRef.current?.click();
  }, []);

  const userWithOverriddenPictureUrl = useMemo(
    () => ({
      ...user,
      ...(pictureUrl ? { pictureUrl } : {}),
    }),
    [pictureUrl, user]
  );

  return (
    <div className={classNames(styles.profileModalAvatar, containerClassName)}>
      <div onClick={uploadProfilePic}>
        <UserAvatar
          imageClassName={styles.image}
          user={userWithOverriddenPictureUrl}
          size="full"
          showStatus
        />
        {editMode && (
          <div className={styles.text}>
            <ImageOverlay disabled={uploadingState.loading}>
              {uploadingState.loading ? "Uploading..." : "Change"}
            </ImageOverlay>
          </div>
        )}
      </div>
      <input
        type="file"
        onChange={handleFileChange}
        accept={ACCEPTED_IMAGE_TYPES}
        ref={uploadRef}
        className={styles.input}
      />
      {register && (
        <input className={styles.input} {...register("pictureUrl")} />
      )}
      {error && <div>{error}</div>}
    </div>
  );
};
