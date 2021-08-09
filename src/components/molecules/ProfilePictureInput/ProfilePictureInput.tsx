import { DefaultAvatars } from "components/molecules/DefaultAvatars/DefaultAvatars";
import React, { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { UserInfo } from "firebase/app";

import { ACCEPTED_IMAGE_TYPES, DEFAULT_PROFILE_PIC } from "settings";

import { useUploadProfilePictureHandler } from "hooks/useUploadProfilePictureHandler";

export interface ProfilePictureInputProps {
  venueId: string;
  setValue: (inputName: string, value: string, rerender: boolean) => void;
  user: UserInfo;
  errors: ReturnType<typeof useForm>["errors"];
  pictureUrl: string;
  register: ReturnType<typeof useForm>["register"];
}

export const ProfilePictureInput: React.FunctionComponent<ProfilePictureInputProps> = ({
  venueId,
  setValue,
  user,
  errors,
  pictureUrl,
  register,
}) => {
  const [isPictureUploading, setIsPictureUploading] = useState(false);
  const [error, setError] = useState("");
  const uploadRef = useRef<HTMLInputElement>(null);

  const uploadProfilePictureHandler = useUploadProfilePictureHandler(
    setError,
    user
  );

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsPictureUploading(true);
      try {
        const pictureUrlRef = await uploadProfilePictureHandler(e);
        if (pictureUrlRef) {
          setValue("pictureUrl", pictureUrlRef, true);
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

  return (
    <div className="profile-picture-upload-form">
      <div
        className="profile-picture-preview-container"
        onClick={() => uploadRef.current?.click()}
      >
        <img
          src={pictureUrl || DEFAULT_PROFILE_PIC}
          className="profile-icon profile-picture-preview"
          alt="your profile"
        />
      </div>
      <input
        type="file"
        id="profile-picture-input"
        name="profilePicture"
        onChange={handleFileChange}
        accept={ACCEPTED_IMAGE_TYPES}
        className="profile-picture-input"
        ref={uploadRef}
      />
      <button
        className="profile-picture-button"
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
        venueId={venueId}
        onAvatarClick={(url) => {
          setValue("pictureUrl", url, true);
        }}
        isLoadingExternal={!!error}
      />
      <input
        name="pictureUrl"
        className="profile-picture-input"
        ref={register({
          required: true,
        })}
      />
    </div>
  );
};
