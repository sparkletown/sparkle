import React, { useCallback, useRef, useState } from "react";
import classNames from "classnames";

import { useBooleanState } from "hooks/useBooleanState";
import { useIsSameUser } from "hooks/useIsSameUser";
import { useUploadProfilePictureHandler } from "hooks/useUploadProfilePictureHandler";
import { useUser } from "hooks/useUser";
import { useForm } from "react-hook-form";

import { UserAvatar } from "components/atoms/UserAvatar";

import { formProp } from "components/organisms/NewProfileModal/utilities";

import { User } from "types/User";
import { ContainerClassName } from "types/utility";
import { WithId } from "utils/id";

import { ACCEPTED_IMAGE_TYPES } from "settings";

import "./ProfileModalAvatar.scss";
import "firebase/storage";

interface Props extends ContainerClassName {
  viewingUser: WithId<User>;
  editMode?: boolean;
  setPictureUrl?: (url: string) => void;
  pictureUrl?: string;
  register?: ReturnType<typeof useForm>["register"];
}

export const ProfileModalAvatar: React.FC<Props> = ({
  editMode,
  viewingUser,
  register,
  pictureUrl,
  setPictureUrl,
  containerClassName,
}: Props) => {
  const sameUser = useIsSameUser(viewingUser);

  const uploadRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const [uploading, uploadStarted, uploadFinished] = useBooleanState(false);

  const { user } = useUser();
  const uploadProfilePictureHandler = useUploadProfilePictureHandler(
    setError,
    user
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
          viewingUser={viewingUser}
          overridePictureUrl={pictureUrl}
          size="profileModal"
          showStatus={!sameUser}
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
