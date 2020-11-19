import React, { useState } from "react";

import { WithId } from "utils/id";
import { User } from "types/User";

import UserProfileModal from "components/organisms/UserProfileModal";
import UserProfilePicture from "components/molecules/UserProfilePicture";

interface MapPartygoersOverlayProps {
  // Passed down from Map component
  venueId: string;
  myUserUid: string;
  rows: number;
  columns: number;

  /** @default false **/
  withMiniAvatars?: boolean;

  // Passed down from Camp component
  partygoers: WithId<User>[];
}

export const MapPartygoersOverlay: React.FC<MapPartygoersOverlayProps> = ({
  venueId,
  myUserUid,
  rows,
  columns,
  withMiniAvatars = false,
  partygoers,
}) => {
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

  return (
    <React.Fragment>
      {partygoers.map((partygoer, index) => {
        const isMe = partygoer.id === myUserUid;
        const position = partygoer?.data?.[venueId];
        const currentRow = position?.row ?? 0;
        const currentCol = position?.column ?? 0;
        const avatarWidth = 100 / columns;
        const avatarHeight = 100 / rows;
        return (
          !!partygoer.id && (
            <UserProfilePicture
              key={`partygoer-${index}`}
              user={partygoer}
              containerStyle={{
                display: "flex",
                width: `${avatarWidth}%`,
                height: `${avatarHeight}%`,
                position: "absolute",
                cursor: "pointer",
                transition: "all 1400ms cubic-bezier(0.23, 1 ,0.32, 1)",
                top: `${avatarHeight * (currentRow - 1)}%`,
                left: `${avatarWidth * (currentCol - 1)}%`,
                justifyContent: "center",
              }}
              avatarStyle={{
                width: "80%",
                height: "80%",
                borderRadius: "100%",
                alignSelf: "center",
                backgroundImage: `url(${partygoer?.pictureUrl})`,
                backgroundSize: "cover",
              }}
              avatarClassName={`${
                isMe ? "me profile-avatar" : "profile-avatar"
              }`}
              setSelectedUserProfile={setSelectedUserProfile}
              miniAvatars={withMiniAvatars}
            />
          )
        );
      })}
      {selectedUserProfile && (
        <UserProfileModal
          show={!!selectedUserProfile}
          onHide={() => setSelectedUserProfile(undefined)}
          userProfile={selectedUserProfile}
        />
      )}
    </React.Fragment>
  );
};
