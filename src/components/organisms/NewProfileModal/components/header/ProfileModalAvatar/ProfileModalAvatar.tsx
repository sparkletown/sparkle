import React, { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import classNames from "classnames";

import { ACCEPTED_IMAGE_TYPES } from "settings";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";
import { userProfileModalFormProp as formProp } from "utils/propName";

import { useIsCurrentUser } from "hooks/useIsCurrentUser";
import { useShowHide } from "hooks/useShowHide";
import { useUploadProfilePictureHandler } from "hooks/useUploadProfilePictureHandler";
import { useUser } from "hooks/useUser";

import { UserAvatar } from "components/atoms/UserAvatar";

import "firebase/storage";

import "./ProfileModalAvatar.scss";

interface Props extends ContainerClassName {
  user: WithId<User>;
  editMode?: boolean;
  setPictureUrl?: (url: string) => void;
  pictureUrl?: string;
  register?: ReturnType<typeof useForm>["register"];
}

export const ProfileModalAvatar: React.FC<Props> = ({
  editMode,
  user,
  register,
  pictureUrl,
  setPictureUrl,
  containerClassName,
}: Props) => {
  const isCurrentUser = useIsCurrentUser(user);

  const uploadRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const {
    isShown: uploading,
    show: uploadStarted,
    hide: uploadFinished,
  } = useShowHide(false);

  const { user: currentUser } = useUser();
  const uploadProfilePictureHandler = useUploadProfilePictureHandler(
    setError,
    currentUser
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      uploadStarted();
      try {
        const pictureUrlRef = await uploadProfilePictureHandler(e);
        if (pictureUrlRef && setPictureUrl) {
          setPictureUrl(pictureUrlRef);
        }
      } finally {
        uploadFinished();
      }
    },
    [uploadStarted, uploadProfilePictureHandler, setPictureUrl, uploadFinished]
  );

  const uploadProfilePic = useCallback((event) => {
    event.preventDefault();
    uploadRef.current?.click();
  }, []);

  return (
    <div className={classNames("ProfileModalAvatar", containerClassName)}>
      <div className="ProfileModalAvatar__upload-new-container">
        <UserAvatar
          imageClassName="ProfileModalAvatar__image"
          user={user}
          overridePictureUrl={pictureUrl}
          size="full"
          showStatus={!isCurrentUser}
        />
        {editMode && (
          <div
            className={classNames("ProfileModalAvatar__upload-new", {
              "ProfileModalAvatar__upload-new--uploading": uploading,
            })}
            onClick={uploadProfilePic}
          >
            {uploading ? "Uploading..." : "Upload new"}
          </div>
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
