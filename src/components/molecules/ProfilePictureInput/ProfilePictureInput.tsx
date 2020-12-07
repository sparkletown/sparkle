import React, { useRef, useState } from "react";
import { useFirebase } from "react-redux-firebase";
import { UserInfo } from "firebase/app";
import { FirebaseStorage } from "@firebase/storage-types";
import {
  ACCEPTED_IMAGE_TYPES,
  GIF_RESIZER_URL,
  MAX_IMAGE_FILE_SIZE_BYTES,
  MAX_IMAGE_FILE_SIZE_TEXT,
} from "settings";
import { resizeFile } from "utils/image";

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
    if (file.size > MAX_IMAGE_FILE_SIZE_BYTES) {
      // New file is with a maximum of 300px width and height, is it possible for the new file to be bigger than 2mb?
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
      <input
        type="hidden"
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
