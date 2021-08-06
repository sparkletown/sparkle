import React, { useCallback, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useFirebase } from "react-redux-firebase";
import { useAsync } from "react-use";
import { UserInfo } from "firebase/app";
import "firebase/storage";

import {
  ACCEPTED_IMAGE_TYPES,
  DEFAULT_AVATARS,
  DEFAULT_PROFILE_PIC,
} from "settings";

import { useSovereignVenue } from "hooks/useSovereignVenue";
import { useUploadProfilePictureHandler } from "hooks/useUploadProfilePictureHandler";

import { Loading } from "components/molecules/Loading";

import "./ProfilePictureInput.scss";

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
  const firebase = useFirebase();
  const uploadRef = useRef<HTMLInputElement>(null);

  const { sovereignVenueId, isSovereignVenueLoading } = useSovereignVenue({
    venueId,
  });

  const {
    value: customAvatars,
    loading: isLoadingCustomAvatars,
  } = useAsync(async () => {
    if (!sovereignVenueId) return;

    const storageRef = firebase.storage().ref();
    const list = await storageRef
      .child(`/assets/avatars/${sovereignVenueId}`)
      .listAll();

    return Promise.all(list.items.map((item) => item.getDownloadURL()));
  }, [firebase, sovereignVenueId]);

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

  const uploadDefaultAvatar = useCallback(
    async (event, avatar: string) => {
      event.preventDefault();
      setValue("pictureUrl", avatar, true);
    },
    [setValue]
  );

  const isLoading =
    (isSovereignVenueLoading || isLoadingCustomAvatars) &&
    (customAvatars !== undefined || error !== undefined);

  const defaultAvatars = customAvatars?.length
    ? customAvatars
    : DEFAULT_AVATARS;

  const avatarImages = useMemo(() => {
    return defaultAvatars.map((avatar, index) => (
      <button
        key={`${avatar}-${index}`}
        className="profile-picture-preview-container"
        onClick={(event) => uploadDefaultAvatar(event, avatar)}
      >
        <img
          src={avatar}
          className="profile-icon profile-picture-preview"
          alt={`default avatar ${index}`}
        />
      </button>
    ));
  }, [defaultAvatars, uploadDefaultAvatar]);

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
      <div className="default-avatars-container">
        {isLoading ? <Loading /> : avatarImages}
      </div>
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
