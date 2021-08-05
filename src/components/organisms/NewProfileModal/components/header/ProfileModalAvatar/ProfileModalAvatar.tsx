import classNames from "classnames";
import { UserAvatar } from "components/atoms/UserAvatar";
import { formProp } from "components/organisms/NewProfileModal/utility";
import "firebase/storage";
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
import { WithId } from "utils/id";
import { resizeFile } from "utils/image";
import "./ProfileModalAvatar.scss";

interface Props extends ContainerClassName {
  viewingUser: WithId<User>;
  editMode?: boolean;
  register?: FormFieldProps["register"];
  setValue?: ReturnType<typeof useForm>["setValue"];
  watch?: ReturnType<typeof useForm>["watch"];
}

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

  const [uploading, uploadStarted, uploadFinished] = useBooleanState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    let file = e.target.files[0];
    if (!file) return;

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type) && setError) {
      setError("Unsupported file, please try with another one.");
      return;
    }

    uploadStarted();
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
      const uploadedProfilePicture = await profilePictureRef.put(file);
      const pictureUrlRef = await uploadedProfilePicture.ref.getDownloadURL();
      if (setValue) setValue(formProp("pictureUrl"), pictureUrlRef, true);

      uploadFinished();
    }
  };

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
