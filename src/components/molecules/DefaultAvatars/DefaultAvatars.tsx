import React, { useCallback, useMemo } from "react";
import { useFirebase } from "react-redux-firebase";
import { useAsync } from "react-use";
import classNames from "classnames";

import { DEFAULT_AVATARS } from "settings";

import { ContainerClassName } from "types/utility";

import { useSovereignVenue } from "hooks/useSovereignVenue";

import "firebase/storage";

import "./DefaultAvatars.scss";

interface Props extends ContainerClassName {
  venueId: string;
  onAvatarClick: (url: string) => void;
  isLoadingExternal?: boolean;
  avatarClassName?: string;
}

export const DefaultAvatars: React.FC<Props> = ({
  venueId,
  onAvatarClick,
  isLoadingExternal,
  avatarClassName,
  containerClassName,
}: Props) => {
  const firebase = useFirebase();

  const { sovereignVenueId, isSovereignVenueLoading } = useSovereignVenue({
    venueId,
  });

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
  }, [firebase, sovereignVenueId]);

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
      >
        <img
          src={avatar}
          className="DefaultAvatars__picture-preview profile-icon"
          alt={`default avatar ${index}`}
        />
      </button>
    ));
  }, [avatarClassName, defaultAvatars, uploadDefaultAvatar]);

  const isLoading =
    (isSovereignVenueLoading || isLoadingCustomAvatars) &&
    (customAvatars !== undefined || isLoadingExternal !== undefined);

  return (
    <div className={classNames("DefaultAvatars", containerClassName)}>
      {!isLoading && avatarImages}
    </div>
  );
};
