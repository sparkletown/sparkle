import React from "react";
import classNames from "classnames";
import { useCss } from "react-use";

import { User } from "types/User";

import { WithId } from "utils/id";

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

// @debt rename this something like MapAvatar?
export const MapPartygoerOverlay: React.FC<MapPartygoerOverlayProps> = ({
  partygoer,
  venueId,
  myUserUid,
  totalRows,
  totalColumns,
  withMiniAvatars = false,
}) => {
  const isMe = partygoer.id === myUserUid;

  const { row = 0, column = 0 } = partygoer?.data?.[venueId] ?? {};

  const containerVars = useCss({
    "--map-partygoer-overlay-total-rows": totalRows,
    "--map-partygoer-overlay-total-columns": totalColumns,
    "--map-partygoer-overlay-row": row,
    "--map-partygoer-overlay-column": column,
  });

  const containerClasses = classNames(
    "MapPartygoerOverlay__avatar-container",
    containerVars,
    { "MapPartygoerOverlay__avatar--me": isMe }
  );

  return (
    <UserProfilePicture
      user={partygoer}
      containerClassName={containerClasses}
      miniAvatars={withMiniAvatars}
    />
  );
};
