import React, { useCallback, useMemo, useRef, useState } from "react";
import { useFirebase } from "react-redux-firebase";
import { useAsync } from "react-use";
import { UserInfo } from "firebase/app";
import { FirebaseStorage } from "@firebase/storage-types";

import { fetchSovereignVenueId } from "api/sovereignVenue";

import {
  ACCEPTED_IMAGE_TYPES,
  DEFAULT_AVATARS,
  MAX_AVATAR_IMAGE_FILE_SIZE_BYTES,
} from "settings";

import { resizeFile } from "utils/image";

import { useQuery } from "hooks/useQuery";

import "./ProfilePictureInput.scss";

type Reference = ReturnType<FirebaseStorage["ref"]>;

interface ProfilePictureInputProps {
  setValue: (inputName: string, value: string, rerender: boolean) => void;
  user: UserInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: Record<string, any>;
  pictureUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
}

const ProfilePictureInput: React.FunctionComponent<ProfilePictureInputProps> = ({
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
  const queryParams = useQuery();
  const venueId = queryParams.get("venueId") ?? "";

  const {
    value: sovereignVenueId,
    loading: isLoadingSovereignVenueId,
  } = useAsync(async () => await fetchSovereignVenueId(venueId));

  const {
    value: customAvatars,
    loading: isLoadingCustomAvatars,
  } = useAsync(async () => {
    const storageRef = firebase.storage().ref();
    const list = await storageRef
      .child(`/assets/avatars/${sovereignVenueId}`)
      .listAll();
    const avatars: string[] = await Promise.all(
      list.items.map((item) => item.getDownloadURL())
    );
    return avatars;
  }, [sovereignVenueId]);

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

  const uploadDefaultAvatar = useCallback(
    async (avatar: string) => {
      setValue("pictureUrl", avatar, true);
    },
    [setValue]
  );

  const isLoading = isLoadingCustomAvatars || isLoadingSovereignVenueId;

  const defaultAvatars = customAvatars?.length
    ? customAvatars
    : DEFAULT_AVATARS;

  const avatarImages = useMemo(() => {
    return defaultAvatars.map((avatar, index) => {
      return (
        <div
          key={`${avatar}-${index}`}
          className="profile-picture-preview-container"
          onClick={() => uploadDefaultAvatar(avatar)}
        >
          <img
            src={`${avatar}`}
            className="profile-icon profile-picture-preview"
            alt="your profile"
          />
        </div>
      );
    });
  }, [defaultAvatars, uploadDefaultAvatar]);

  return (
    <div className="profile-picture-upload-form">
      <div
        className="profile-picture-preview-container"
        onClick={() => uploadRef.current?.click()}
      >
        <img
          src={pictureUrl || "/default-profile-pic.png"}
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
      <label htmlFor="profile-picture-input" className="profile-picture-button">
        Upload your profile pic
      </label>
      {errors.pictureUrl && errors.pictureUrl.type === "required" && (
        <span className="input-error">Profile picture is required</span>
      )}
      {isPictureUploading && <small>Picture uploading...</small>}
      {error && <small>Error uploading: {error}</small>}
      <small>Or pick one from our Sparkle profile pics</small>
      <div className="default-avatars-container">
        {isLoading && <div>Loading...</div>}
        {!isLoading && avatarImages}
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

export default ProfilePictureInput;
