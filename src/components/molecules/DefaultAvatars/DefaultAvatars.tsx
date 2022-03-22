import React, { useCallback, useMemo } from "react";
import { useAsync } from "react-use";
import classNames from "classnames";
import firebase from "firebase/compat/app";

import { DEFAULT_AVATAR_LIST } from "settings";

import { useRelatedVenues } from "hooks/useRelatedVenues";

import "firebase/storage";

import styles from "./DefaultAvatars.module.scss";

export interface DefaultAvatarsProps {
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
}) => {
  const {
    sovereignVenueId,
    isLoading: isSovereignVenueLoading,
  } = useRelatedVenues();

  const {
    value: customAvatars,
    loading: isLoadingCustomAvatars,
  } = useAsync(async () => {
    if (!sovereignVenueId) return;

    const storageRef = firebase.storage().ref();
    const list = await storageRef
      .child(`/assets/avatars/${sovereignVenueId}`)
      .listAll();

    return Promise.all(list.items.map((item) => item.getDownloadURL()));
  }, [sovereignVenueId]);

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
        className={classNames("w-12 h-12 mr-1", avatarClassName)}
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
  }, [
    avatarClassName,
    avatarPictureClassName,
    defaultAvatars,
    uploadDefaultAvatar,
  ]);

  const isLoading =
    (isSovereignVenueLoading || isLoadingCustomAvatars) &&
    (customAvatars !== undefined || isLoadingExternal !== undefined);

  return (
    <div data-bem="DefaultAvatars" className={styles.defaultAvatars}>
      {!isLoading && avatarImages}
    </div>
  );
};
