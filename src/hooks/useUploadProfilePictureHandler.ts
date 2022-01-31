import { ChangeEvent, useCallback } from "react";
import { getDownloadURL,getStorage, ref, uploadBytes } from "firebase/storage";
import { v4 as uuid } from "uuid";

import {
  ACCEPTED_IMAGE_TYPES,
  MAX_AVATAR_IMAGE_FILE_SIZE_BYTES,
} from "settings";

import { UserId } from "types/id";

import { resizeFile } from "utils/image";


export const useUploadProfilePictureHandler = (
  setError: (error: string) => void,
  userId?: UserId
) => {
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
      if (userId) {
        // We append a uuid to the filename to ensure every file created has a unique name.
        // This helps avoiding cache invalidation.
        const storage = getStorage();
        const profilePictureRef = ref(storage, `/users/${userId}/${uuid()}_${file.name}`);
        await uploadBytes(profilePictureRef, file);
        return await getDownloadURL(profilePictureRef);
      } else {
        return undefined;
      }
    },
    [setError, userId]
  );
};
