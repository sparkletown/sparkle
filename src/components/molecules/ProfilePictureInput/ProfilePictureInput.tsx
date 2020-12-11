import React, { useRef, useState } from "react";
import { useFirebase } from "react-redux-firebase";
import { UserInfo } from "firebase/app";
import { FirebaseStorage } from "@firebase/storage-types";

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_IMAGE_FILE_SIZE_BYTES,
} from "settings";

import { resizeFile } from "utils/image";

import "./ProfilePictureInput.scss";

type Reference = ReturnType<FirebaseStorage["ref"]>;

interface PropsType {
  setValue: (inputName: string, value: string, rerender: boolean) => void;
  user: UserInfo;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  errors: Record<string, any>;
  pictureUrl: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register: any;
}

const sparkleAvatars = [
  "default-profile-pic-1.png",
  "default-profile-pic-2.png",
  "default-profile-pic-3.png",
  "default-profile-pic-4.png",
];

const ProfilePictureInput: React.FunctionComponent<PropsType> = ({
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

  const uploadDefaultAvatar = async (avatar: string) => {
    setValue("pictureUrl", process.env.PUBLIC_URL + `/avatars/${avatar}`, true);
  };

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
        {sparkleAvatars.map((avatar, index) => {
          return (
            <div
              key={`${avatar}-${index}`}
              className="profile-picture-preview-container"
              onClick={() => uploadDefaultAvatar(avatar)}
            >
              <img
                src={`/avatars/${avatar}`}
                className="profile-icon profile-picture-preview"
                alt="your profile"
              />
            </div>
          );
        })}
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
