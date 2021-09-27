import React, { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useAsyncFn } from "react-use";
import classNames from "classnames";

import { ACCEPTED_IMAGE_TYPES } from "settings";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";
import { userProfileModalFormProp as formProp } from "utils/propName";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useUploadProfilePictureHandler } from "hooks/useUploadProfilePictureHandler";
import { useUser } from "hooks/useUser";

import { ImageOverlay } from "components/atoms/ImageOverlay";
import { UserAvatar } from "components/atoms/UserAvatar";

import "firebase/storage";

import "./ProfileModalAvatar.scss";

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
  const isCurrentUser = useIsCurrentUser(user.id);

  const uploadRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const { user: currentUser } = useUser();
  const uploadProfilePictureHandler = useUploadProfilePictureHandler(
    setError,
    currentUser
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
    <div className={classNames("ProfileModalAvatar", containerClassName)}>
      <div className="ProfileModalAvatar__upload-new-container">
        <UserAvatar
          imageClassName="ProfileModalAvatar__image"
          user={userWithOverriddenPictureUrl}
          size="full"
          showStatus={!isCurrentUser}
        />
        {editMode && (
          <ImageOverlay
            disabled={uploadingState.loading}
            onClick={uploadProfilePic}
          >
            {uploadingState.loading ? "Uploading..." : "Upload new"}
          </ImageOverlay>
        )}
      </div>
      <input
        type="file"
        onChange={handleFileChange}
        accept={ACCEPTED_IMAGE_TYPES}
        ref={uploadRef}
        className="ProfileModalAvatar__input"
      />
      {register && (
        <input
          name={formProp("pictureUrl")}
          className="ProfileModalAvatar__input"
          ref={register()}
        />
      )}
      {error && <div className="ProfileModalAvatar__error">{error}</div>}
    </div>
  );
};
