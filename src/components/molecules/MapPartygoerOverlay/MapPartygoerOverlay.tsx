import React, { useMemo } from "react";
import classNames from "classnames";

import { WithId } from "utils/id";
import { User } from "types/User";

import { UserProfilePicture } from "components/molecules/UserProfilePicture";

import "./MapPartygoerOverlay.scss";

export interface MapPartygoerOverlayProps {
  partygoer: WithId<User>;

  venueId: string;
  myUserUid: string;
  totalRows: number;
  totalColumns: number;

  /** @default false **/
  withMiniAvatars?: boolean;
}

export const MapPartygoerOverlay: React.FC<MapPartygoerOverlayProps> = ({
  partygoer,
  venueId,
  myUserUid,
  totalRows,
  totalColumns,
  withMiniAvatars = false,
}) => {
  const isMe = partygoer.id === myUserUid;
  const position = partygoer?.data?.[venueId];
  const currentRow = position?.row ?? 0;
  const currentCol = position?.column ?? 0;
  const avatarWidth = 100 / totalColumns;
  const avatarHeight = 100 / totalRows;

  const containerStyle = useMemo(
    () => ({
      width: `${avatarWidth}%`,
      height: `${avatarHeight}%`,
      top: `${avatarHeight * (currentRow - 1)}%`,
      left: `${avatarWidth * (currentCol - 1)}%`,
    }),
    [avatarHeight, avatarWidth, currentCol, currentRow]
  );

  return (
    <UserProfilePicture
      user={partygoer}
      containerClassName="MapPartygoerOverlay__avatar-container"
      avatarClassName={classNames({ "MapPartygoerOverlay__avatar--me": isMe })}
      containerStyle={containerStyle}
      miniAvatars={withMiniAvatars}
    />
  );
};
