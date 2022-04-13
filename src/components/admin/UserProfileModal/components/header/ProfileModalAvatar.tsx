import React, { useCallback, useMemo, useRef, useState } from "react";
import { UseFormRegister } from "react-hook-form";
import { useAsyncFn } from "react-use";
import { CenterContent } from "components/shared/CenterContent";

import { ACCEPTED_IMAGE_TYPES } from "settings";

import { UserProfileModalFormData } from "types/profileModal";
import { User } from "types/User";
import { ContainerClassName } from "types/utility";

import { WithId } from "utils/id";

import { useUserId } from "hooks/user/useUserId";
import { useUploadProfilePictureHandler } from "hooks/useUploadProfilePictureHandler";

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

  const { userId } = useUserId();
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
    <div data-bem="ProfileModalAvatar" className="flex-shrink-0 h-20 w-20">
      <div
        data-bem="ProfileModalAvatar__upload-new-container"
        className="relative"
      >
        <UserAvatar
          imageClassName="rounded-full w-20 h-20"
          user={userWithOverriddenPictureUrl}
          size="full"
          showStatus
        />
        {editMode && (
          <div onClick={uploadProfilePic}>
            <CenterContent disabled={uploadingState.loading}>
              {uploadingState.loading ? "Uploading..." : "Upload new"}
            </CenterContent>
          </div>
        )}
      </div>
      <input
        data-bem="ProfileModalAvatar__input"
        type="file"
        onChange={handleFileChange}
        accept={ACCEPTED_IMAGE_TYPES}
        ref={uploadRef}
        className="invisible"
      />
      {register && (
        <input
          data-bem="ProfileModalAvatar__input"
          className="invisible"
          {...register("pictureUrl")}
        />
      )}
      {error && <div data-bem="ProfileModalAvatar__error">{error}</div>}
    </div>
  );
};
