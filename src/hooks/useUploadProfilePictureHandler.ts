import { ChangeEvent, useCallback } from "react";
import { useFirebase } from "react-redux-firebase";
import firebase from "firebase/compat/app";
import { v4 as uuid } from "uuid";

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_IMAGE_FILE_SIZE_BYTES,
} from "settings";

import { resizeFile } from "utils/image";

import "firebase/storage";

export const useUploadProfilePictureHandler = (
  setError: (error: string) => void,
  user?: firebase.UserInfo
) => {
  const firebase = useFirebase();

  return useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
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
      if (user?.uid) {
        // We append a uuid to the filename to ensure every file created has a unique name.
        // This helps avoiding cache invalidation.
        const profilePictureRef = storageRef.child(
          `/users/${user.uid}/${uuid()}_${file.name}`
        );
        const uploadedProfilePicture = await profilePictureRef.put(file);
        return await uploadedProfilePicture.ref.getDownloadURL();
      } else {
        return undefined;
      }
    },
    [firebase, setError, user?.uid]
  );
};
