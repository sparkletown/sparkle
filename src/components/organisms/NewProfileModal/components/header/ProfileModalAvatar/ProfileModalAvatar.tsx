import { FirebaseStorage } from "@firebase/storage-types";
import classNames from "classnames";
import { UserAvatar } from "components/atoms/UserAvatar";
import { formProp } from "components/organisms/NewProfileModal/utility";
import { useBooleanState } from "hooks/useBooleanState";
import { useSameUser } from "hooks/useIsSameUser";
import { useUser } from "hooks/useUser";
import React, { useCallback, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useFirebase } from "react-redux-firebase";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_IMAGE_FILE_SIZE_BYTES,
} from "settings";
import { FormFieldProps } from "types/forms";
import { User } from "types/User";
import { ContainerClassName } from "types/utility";
import "./ProfileModalAvatar.scss";
import { WithId } from "utils/id";
import { resizeFile } from "utils/image";

interface Props extends ContainerClassName {
  viewingUser: WithId<User>;
  editMode?: boolean;
  register?: FormFieldProps["register"];
  setValue?: ReturnType<typeof useForm>["setValue"];
  watch?: ReturnType<typeof useForm>["watch"];
}

type Reference = ReturnType<FirebaseStorage["ref"]>;

export const ProfileModalAvatar: React.FC<Props> = ({
  editMode,
  viewingUser,
  register,
  setValue,
  watch,
  containerClassName,
}: Props) => {
  const { user } = useUser();
  const firebase = useFirebase();
  const uploadRef = useRef<HTMLInputElement>(null);
  const sameUser = useSameUser(viewingUser);
  const [error, setError] = useState("");

  const pictureUrl = watch?.(formProp("pictureUrl"));

  const [, setUploading, setNotUploading] = useBooleanState(false);

  const uploadPicture = async (profilePictureRef: Reference, file: File) => {
    setUploading();
    const uploadedProfilePicture = await profilePictureRef.put(file);
    setNotUploading();
    return uploadedProfilePicture;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("change");
    if (!e.target.files) return;

    let file = e.target.files[0];
    // When file selection is cancelled, undefined is returned.
    // Suggestion: create a guard function to avoid if / return.
    if (!file) return;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type) && setError) {
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
    if (user) {
      const profilePictureRef = storageRef.child(
        `/users/${user.uid}/${file.name}`
      );
      const uploadedProfilePicture = await uploadPicture(
        profilePictureRef,
        file
      );
      const pictureUrlRef = await uploadedProfilePicture.ref.getDownloadURL();
      if (setValue) setValue(formProp("pictureUrl"), pictureUrlRef, true);
    }
  };

  const uploadProfilePic = useCallback((event) => {
    console.log("clicked");
    event.preventDefault();
    uploadRef.current?.click();
  }, []);

  return (
    <div className="ProfileModalAvatar">
      <UserAvatar
        viewingUser={viewingUser}
        overridePictureUrl={pictureUrl}
        size="profileModal"
        showStatus={!sameUser}
      />
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
          className="profile-picture-input"
          ref={register()}
        />
      )}
      {editMode && (
        <div
          className={classNames(
            "ProfileModalAvatar__upload-new",
            containerClassName
          )}
          onClick={uploadProfilePic}
        >
          Upload new {error}
        </div>
      )}
    </div>
  );
};
