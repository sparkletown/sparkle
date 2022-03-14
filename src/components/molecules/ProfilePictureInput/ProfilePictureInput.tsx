import React, { useCallback, useRef, useState } from "react";
import { FieldErrors, UseFormRegister, UseFormSetValue } from "react-hook-form";

import { ACCEPTED_IMAGE_TYPES } from "settings";

import { UserId } from "types/id";

import { determineAvatar } from "utils/image";

import { useLoginCheck } from "hooks/user/useLoginCheck";
import { useUploadProfilePictureHandler } from "hooks/useUploadProfilePictureHandler";

import { ProfileFormData } from "pages/Account/Profile";

import { DefaultAvatars } from "components/molecules/DefaultAvatars/DefaultAvatars";

import styles from "./ProfilePictureInput.module.scss";

export interface ProfilePictureInputProps {
  setValue: UseFormSetValue<ProfileFormData>;
  userId: UserId;
  errors: FieldErrors<ProfileFormData>;
  pictureUrl: string;
  register: UseFormRegister<ProfileFormData>;
}

export const ProfilePictureInput: React.FunctionComponent<ProfilePictureInputProps> = ({
  setValue,
  userId,
  errors,
  pictureUrl,
  register,
}) => {
  const [isPictureUploading, setIsPictureUploading] = useState(false);
  const [error, setError] = useState("");
  const uploadRef = useRef<HTMLInputElement>(null);
  const { user } = useLoginCheck();

  const uploadProfilePictureHandler = useUploadProfilePictureHandler(
    setError,
    userId
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPictureUploading(true);
      try {
        const pictureUrlRef = await uploadProfilePictureHandler(e);
        if (pictureUrlRef) {
          setValue("pictureUrl", pictureUrlRef, { shouldValidate: true });
        }
      } finally {
        setIsPictureUploading(false);
      }
    },
    [setValue, uploadProfilePictureHandler]
  );

  const uploadProfilePic = useCallback((event) => {
    event.preventDefault();
    uploadRef.current?.click();
  }, []);

  const setPictureUrl = useCallback(
    (url: string) => {
      setValue("pictureUrl", url, { shouldValidate: true });
    },
    [setValue]
  );

  const hasError = !!error;

  const { src: pictureSrc, onError: onPictureSrcError } = determineAvatar({
    pictureUrl,
    userInfo: user,
  });

  return (
    <div className={styles.profilePictureUploadForm}>
      <div
        className={styles.profilePicturePreviewContainer}
        onClick={() => uploadRef.current?.click()}
      >
        <img
          src={pictureSrc}
          onError={onPictureSrcError}
          className="profile-icon ProfilePicturePreviewContainer__image"
          alt="your profile"
        />
      </div>
      <input
        type="file"
        id="profile-picture-input"
        name="profilePicture"
        onChange={handleFileChange}
        accept={ACCEPTED_IMAGE_TYPES}
        className="ProfilePictureUploadForm__input"
        ref={uploadRef}
      />
      <button
        className="ProfilePictureUploadForm__uploadButton"
        onClick={(event) => uploadProfilePic(event)}
      >
        Upload your profile pic
      </button>
      {errors.pictureUrl && errors.pictureUrl.type === "required" && (
        <span className="input-error">Profile picture is required</span>
      )}
      {isPictureUploading && <small>Picture uploading...</small>}
      {error && <small>Error uploading: {error}</small>}
      <small>Or pick one from our Sparkle profile pics</small>
      <DefaultAvatars
        onAvatarClick={setPictureUrl}
        isLoadingExternal={hasError}
      />
      <input
        className={styles.hiddenInput}
        {...register("pictureUrl", {
          required: true,
        })}
      />
    </div>
  );
};
