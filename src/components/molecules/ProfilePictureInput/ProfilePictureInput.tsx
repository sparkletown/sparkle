import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFirebase } from "react-redux-firebase";
import { UserInfo } from "firebase/app";
import { FirebaseStorage } from "@firebase/storage-types";
import "firebase/storage";

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_IMAGE_FILE_SIZE_BYTES,
} from "settings";

import { resizeFile } from "utils/image";
import { externalUrlAdditionalProps } from "utils/url";

import "./ProfilePictureInput.scss";

type Reference = ReturnType<FirebaseStorage["ref"]>;

export interface ProfilePictureInputProps {
  venueId: string;
  setValue: (inputName: string, value: string, rerender: boolean) => void;
  user: UserInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: Record<string, any>;
  pictureUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
  githubHandle?: string;
}

export const ProfilePictureInput: React.FunctionComponent<ProfilePictureInputProps> = ({
  venueId,
  setValue,
  user,
  errors,
  pictureUrl,
  register,
  githubHandle,
}) => {
  const [isPictureUploading, setIsPictureUploading] = useState(false);
  const [error, setError] = useState("");
  const firebase = useFirebase();
  const uploadRef = useRef<HTMLInputElement>(null);

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

  // NOTE: if githubHandle is invalid, the resulting avatar will be invalid as well e.g. https://github.com/invalid-github-handle.png?size=120
  const githubImageSrc = githubHandle
    ? `https://github.com/${githubHandle}.png?size=120`
    : "/avatars/default-octocat-3.png";

  // Set GitHub image as a default picture
  useEffect(() => {
    if (!githubImageSrc || pictureUrl) return;
    setValue("pictureUrl", githubImageSrc, true);
  }, [githubImageSrc, setValue, pictureUrl]);

  return (
    <div className="profile-picture-upload-form">
      <div
        className="profile-picture-preview-container"
        onClick={() => uploadRef.current?.click()}
      >
        <img
          src={pictureUrl}
          className="profile-icon profile-picture-preview"
          alt="your profile"
        />
      </div>
      <p className="profile-picture-options">
        Want to change your profile photo? Take a{" "}
        <a
          className="button--a"
          href="https://virtual.githubphotobooth.com/virtual/capture/gr99n"
          {...externalUrlAdditionalProps}
        >
          Summit snap
        </a>{" "}
        or{" "}
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
          Upload your photo
        </button>
      </p>
      {errors.pictureUrl && errors.pictureUrl.type === "required" && (
        <span className="input-error">Profile picture is required</span>
      )}
      {isPictureUploading && <small>Picture uploading...</small>}
      {error && <small>Error uploading: {error}</small>}
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
