import React, { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import classNames from "classnames";

import { ACCEPTED_IMAGE_TYPES } from "settings";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";
import { userProfileModalFormProp as formProp } from "utils/propName";

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
  register?: ReturnType<typeof useForm>["register"];
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
    <div className={classNames(styles.ProfileModalAvatar, containerClassName)}>
      <div onClick={uploadProfilePic}>
        <UserAvatar
          imageClassName={styles.ProfileModalAvatar__image}
          user={userWithOverriddenPictureUrl}
          size="full"
          showStatus
        />
        {editMode && (
          <div className={styles.ProfileModalAvatar__text}>
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
        className={styles.ProfileModalAvatar__input}
      />
      {register && (
        <input
          name={formProp("pictureUrl")}
          className={styles.ProfileModalAvatar__input}
          ref={register()}
        />
      )}
      {error && <div>{error}</div>}
    </div>
  );
};
