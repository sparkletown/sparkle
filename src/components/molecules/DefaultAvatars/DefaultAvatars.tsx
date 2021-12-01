import React, { useCallback, useMemo } from "react";
import { useFirebase } from "react-redux-firebase";
import { useAsync } from "react-use";
import classNames from "classnames";

import { DEFAULT_AVATARS } from "settings";

import { ContainerClassName } from "types/utility";

import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";

import "firebase/storage";

import "./DefaultAvatars.scss";

export interface DefaultAvatarsProps extends ContainerClassName {
  onAvatarClick: (url: string) => void;
  isLoadingExternal?: boolean;
  avatarClassName?: string;
  avatarPictureClassName?: string;
}

export const DefaultAvatars: React.FC<DefaultAvatarsProps> = ({
  onAvatarClick,
  isLoadingExternal,
  avatarClassName,
  avatarPictureClassName,
  containerClassName,
}) => {
  const firebase = useFirebase();

  const { spaceSlug } = useSpaceParams();

  const { space, isLoaded: isSpaceLoaded } = useSpaceBySlug(spaceSlug);

  const spaceId = space?.id;

  const {
    value: customAvatars,
    loading: isLoadingCustomAvatars,
  } = useAsync(async () => {
    if (!spaceId) return;

    const storageRef = firebase.storage().ref();
    const list = await storageRef.child(`/assets/avatars/${spaceId}`).listAll();

    return Promise.all(list.items.map((item) => item.getDownloadURL()));
  }, [firebase, spaceId]);

  const defaultAvatars = customAvatars?.length
    ? customAvatars
    : DEFAULT_AVATARS;

  const uploadDefaultAvatar = useCallback(
    async (event, avatar: string) => {
      event.preventDefault();
      onAvatarClick(avatar);
    },
    [onAvatarClick]
  );

  const avatarImages = useMemo(() => {
    return defaultAvatars.map((avatar, index) => (
      <button
        key={`${avatar}-${index}`}
        className={classNames(
          "DefaultAvatars__preview-container",
          avatarClassName
        )}
        onClick={(event) => uploadDefaultAvatar(event, avatar)}
        type="button"
      >
        <img
          src={avatar}
          className={classNames(
            "DefaultAvatars__picture-preview profile-icon",
            avatarPictureClassName
          )}
          alt={`default avatar ${index}`}
        />
      </button>
    ));
  }, [
    avatarClassName,
    avatarPictureClassName,
    defaultAvatars,
    uploadDefaultAvatar,
  ]);

  const isLoading =
    (isSpaceLoaded || isLoadingCustomAvatars) &&
    (customAvatars !== undefined || isLoadingExternal !== undefined);

  return (
    <div className={classNames("DefaultAvatars", containerClassName)}>
      {!isLoading && avatarImages}
    </div>
  );
};
