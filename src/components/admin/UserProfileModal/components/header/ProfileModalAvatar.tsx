import React, { useCallback, useMemo, useRef, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { ImageOverlay } from "components/shared/ImageOverlay";

import { ACCEPTED_IMAGE_TYPES } from "settings";

import { UserProfileModalFormData } from "types/profileModal";
import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useUploadProfilePictureHandler } from "hooks/useUploadProfilePictureHandler";
import { useUser } from "hooks/useUser";

import { UserAvatar } from "components/atoms/UserAvatar";

import "firebase/storage";

export interface ProfileModalAvatarProps extends ContainerClassName {
  user: WithId<User>;
  editMode?: boolean;
  setPictureUrl?: (url: string) => void;
  pictureUrl?: string;
  register?: UseFormRegister<UserProfileModalFormData>;
}

export const ProfileModalAvatar: React.FC<ProfileModalAvatarProps> = ({
  editMode,
  user,
  register,
  pictureUrl,
  setPictureUrl,
}: ProfileModalAvatarProps) => {
  const uploadRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");

  const { userId } = useUser();
  const uploadProfilePictureHandler = useUploadProfilePictureHandler(
    setError,
    userId
  );

  const [uploadingState, handleFileChange] = useAsyncFn(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const pictureUrlRef = await uploadProfilePictureHandler(e);
      if (pictureUrlRef && setPictureUrl) {
        setPictureUrl(pictureUrlRef);
      }
    },
    [uploadProfilePictureHandler, setPictureUrl]
  );

  const uploadProfilePic = useCallback((event) => {
    event.preventDefault();
    uploadRef.current?.click();
  }, []);

  const userWithOverriddenPictureUrl = useMemo(
    () => ({
      ...user,
      ...(pictureUrl ? { pictureUrl } : {}),
    }),
    [pictureUrl, user]
  );

  return (
    <div className="ProfileModalAvatar flex-shrink-0 h-20 w-20">
      <div className="ProfileModalAvatar__upload-new-container relative">
        <UserAvatar
          imageClassName="rounded-full w-20 h-20"
          user={userWithOverriddenPictureUrl}
          size="full"
          showStatus
        />
        {editMode && (
          <div onClick={uploadProfilePic}>
            <ImageOverlay disabled={uploadingState.loading}>
              {uploadingState.loading ? "Uploading..." : "Upload new"}
            </ImageOverlay>
          </div>
        )}
      </div>
      <input
        type="file"
        onChange={handleFileChange}
        accept={ACCEPTED_IMAGE_TYPES}
        ref={uploadRef}
        className="ProfileModalAvatar__input invisible"
      />
      {register && (
        <input
          className="ProfileModalAvatar__input invisible"
          {...register("pictureUrl")}
        />
      )}
      {error && <div className="ProfileModalAvatar__error">{error}</div>}
    </div>
  );
};
