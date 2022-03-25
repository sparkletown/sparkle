import React, { useCallback, useMemo } from "react";
import { useAsync } from "react-use";
import classNames from "classnames";
import firebase from "firebase/compat/app";

import { DEFAULT_AVATAR_LIST } from "settings";

import { useWorldAndSpaceByParams } from "hooks/spaces/useWorldAndSpaceByParams";

import "firebase/storage";

import styles from "./DefaultAvatars.module.scss";

export interface DefaultAvatarsProps {
  onAvatarClick: (url: string) => void;
  isLoadingExternal?: boolean;
  avatarPictureClassName?: string;
}

export const DefaultAvatars: React.FC<DefaultAvatarsProps> = ({
  onAvatarClick,
  isLoadingExternal,
  avatarPictureClassName,
}) => {
  const { worldId, isLoaded: isWorldLoaded } = useWorldAndSpaceByParams();

  const {
    value: customAvatars,
    loading: isLoadingCustomAvatars,
  } = useAsync(async () => {
    if (!worldId) return;

    // @debt access to DB should be move out of components and into `src/api` and/or `src/hooks` layers
    const storageRef = firebase.storage().ref();
    const list = await storageRef.child(`/assets/avatars/${worldId}`).listAll();

    return Promise.all(list.items.map((item) => item.getDownloadURL()));
  }, [worldId]);

  const defaultAvatars = customAvatars?.length
    ? customAvatars
    : DEFAULT_AVATAR_LIST;

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
        data-bem="DefaultAvatars__preview-container"
        key={`${avatar}-${index}`}
        className="w-12 h-12 mr-1"
        onClick={(event) => uploadDefaultAvatar(event, avatar)}
        type="button"
      >
        <img
          data-bem="DefaultAvatars__picture-preview"
          src={avatar}
          className={classNames("profile-icon", avatarPictureClassName)}
          alt={`default avatar ${index}`}
        />
      </button>
    ));
  }, [avatarPictureClassName, defaultAvatars, uploadDefaultAvatar]);

  const isLoading =
    (!isWorldLoaded || isLoadingCustomAvatars) &&
    (customAvatars !== undefined || isLoadingExternal !== undefined);

  return (
    <div data-bem="DefaultAvatars" className={styles.defaultAvatars}>
      {!isLoading && avatarImages}
    </div>
  );
};
