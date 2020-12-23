import React, { useMemo } from "react";

import { WithId } from "utils/id";
import { Experience, User } from "types/User";

import UserProfilePicture from "components/molecules/UserProfilePicture";

interface MapPartygoerOverlayProps {
  partygoer: WithId<User>;
  position: Experience;
  totalRows: number;
  totalColumns: number;

  /** @default false **/
  withMiniAvatars?: boolean;
  myUserUid?: string;
  setSelectedUserProfile: (user: WithId<User>) => void;
}

export const _MapPartygoerOverlay: React.FC<MapPartygoerOverlayProps> = ({
  partygoer,
  position,
  myUserUid,
  totalRows,
  totalColumns,
  withMiniAvatars = false,
  setSelectedUserProfile,
}) => {
  const isMe = myUserUid && partygoer.id === myUserUid;
  const currentRow = position.row ?? 0;
  const currentCol = position.column ?? 0;
  const avatarWidth = 100 / totalColumns;
  const avatarHeight = 100 / totalRows;

  const containerStyle = useMemo(
    () => ({
      display: "flex",
      width: `${avatarWidth}%`,
      height: `${avatarHeight}%`,
      position: "absolute",
      cursor: "pointer",
      top: `${avatarHeight * (currentRow - 1)}%`,
      left: `${avatarWidth * (currentCol - 1)}%`,
      justifyContent: "center",
    }),
    [avatarHeight, avatarWidth, currentCol, currentRow]
  );

  const pictureUrl = partygoer?.pictureUrl;
  const avatarStyle = useMemo(
    () => ({
      width: "80%",
      height: "80%",
      borderRadius: "100%",
      alignSelf: "center",
      backgroundImage: `url(${pictureUrl})`,
      backgroundSize: "cover",
    }),
    [pictureUrl]
  );

  return (
    <UserProfilePicture
      user={partygoer}
      avatarClassName={`${isMe ? "me profile-avatar" : "profile-avatar"}`}
      containerStyle={containerStyle}
      avatarStyle={avatarStyle}
      setSelectedUserProfile={setSelectedUserProfile}
      miniAvatars={withMiniAvatars}
    />
  );
};

export const MapPartygoerOverlay = React.memo(_MapPartygoerOverlay);
