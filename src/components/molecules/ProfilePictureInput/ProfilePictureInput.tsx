import React, { useCallback, useMemo, useRef, useState } from "react";
import { useFirebase } from "react-redux-firebase";
import { useAsync } from "react-use";
import { FirebaseStorage } from "@firebase/storage-types";
import firebase from "firebase/app";

import {
  ACCEPTED_IMAGE_TYPES,
  DEFAULT_AVATARS,
  MAX_AVATAR_IMAGE_FILE_SIZE_BYTES,
} from "settings";

import { resizeFile } from "utils/image";

import { useSovereignVenue } from "hooks/useSovereignVenue";

import { Loading } from "components/molecules/Loading";

import "firebase/storage";

import "./ProfilePictureInput.scss";

type Reference = ReturnType<FirebaseStorage["ref"]>;

export interface ProfilePictureInputProps {
  venueId: string;
  setValue: (inputName: string, value: string, rerender: boolean) => void;
  user: firebase.UserInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: Record<string, any>;
  pictureUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
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

  const uploadPicture = async (profilePictureRef: Reference, file: File) => {
    setIsPictureUploading(true);
    const uploadedProfilePicture = await profilePictureRef.put(file);
    setIsPictureUploading(false);
    return uploadedProfilePicture;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    let file = e.target.files[0];
    // When file selection is cancelled, undefined is returned.
    // Suggestion: create a guard function to avoid if / return.
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      setError("Unsupported file, please try with another one.");
      return;
    }
    if (file.size > MAX_AVATAR_IMAGE_FILE_SIZE_BYTES) {
      const resizedImage = await resizeFile(e.target.files[0]);
      const fileName = file.name;
      file = new File([resizedImage], fileName);
    }
    const storageRef = firebase.storage().ref();
    // TODO: add rule to forbid other users to edit a user's image
    const profilePictureRef = storageRef.child(
      `/users/${user.uid}/${file.name}`
    );
    const uploadedProfilePicture = await uploadPicture(profilePictureRef, file);
    const pictureUrlRef = await uploadedProfilePicture.ref.getDownloadURL();
    setValue("pictureUrl", pictureUrlRef, true);
  };

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
        className="ProfilePicturePreviewContainer"
        onClick={(event) => uploadDefaultAvatar(event, avatar)}
      >
        <img
          src={avatar}
          className="profile-icon ProfilePicturePreviewContainer__image--small"
          alt={`default avatar ${index}`}
        />
      </button>
    ));
  }, [defaultAvatars, uploadDefaultAvatar]);

  return (
    <div className="ProfilePictureUploadForm">
      <div
        className="ProfilePicturePreviewContainer"
        onClick={() => uploadRef.current?.click()}
      >
        <img
          src={pictureUrl || "/default-profile-pic.png"}
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
      <div className="ProfilePictureUploadForm__defaultAvatarsContainer">
        {isLoading ? <Loading /> : avatarImages}
      </div>
      <input
        name="pictureUrl"
        className="ProfilePictureUploadForm__input"
        ref={register({
          required: true,
        })}
      />
    </div>
  );
};
