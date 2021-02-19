import React, { useState } from "react";

import {
  DEFAULT_PARTY_NAME,
  DEFAULT_PROFILE_IMAGE,
  REACTION_PROFILE_IMAGE_SIZE_LARGE,
  REACTION_PROFILE_IMAGE_SIZE_SMALL,
} from "settings";

import {
  MessageToTheBandReaction,
  Reaction,
  ReactionsTextMap,
} from "utils/reactions";
import { WithId } from "utils/id";

import { User } from "types/User";
import { ChatMessage } from "types/chat";

import { useWorldUsersById } from "hooks/users";

import UserProfileModal from "components/organisms/UserProfileModal";

interface ReactionListProps {
  reactions: Reaction[];
  chats: ChatMessage[];
  small?: boolean;
}

const ReactionList: React.FC<ReactionListProps> = ({
  reactions,
  chats,
  small = false,
}) => {
  const { worldUsersById } = useWorldUsersById();
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

  const allReactions = [
    ...(reactions ?? []),
    ...(chats ?? []).map(
      (chat) =>
        ({
          created_at: chat.ts_utc.toMillis() / 1000,
          created_by: chat.from,
          text: chat.text,
        } as MessageToTheBandReaction)
    ),
  ].sort((a, b) => b.created_at - a.created_at);

  const profileImageSize = small
    ? REACTION_PROFILE_IMAGE_SIZE_SMALL
    : REACTION_PROFILE_IMAGE_SIZE_LARGE;
  return (
    <>
      <div className={`reaction-list ${small && "small"}`}>
        {allReactions.map((message) => (
          <div
            className="message"
            key={`${message.created_by}-${message.created_at}`}
          >
            <img
              onClick={() =>
                worldUsersById[message.created_by] &&
                setSelectedUserProfile({
                  ...worldUsersById[message.created_by],
                  id: message.created_by,
                })
              }
              key={`${message.created_by}-messaging-the-band`}
              className="profile-icon"
              src={
                (!worldUsersById[message.created_by]?.anonMode &&
                  worldUsersById[message.created_by]?.pictureUrl) ||
                DEFAULT_PROFILE_IMAGE
              }
              title={
                (!worldUsersById[message.created_by]?.anonMode &&
                  worldUsersById[message.created_by]?.partyName) ||
                DEFAULT_PARTY_NAME
              }
              alt={`${
                (!worldUsersById[message.created_by]?.anonMode &&
                  worldUsersById[message.created_by]?.partyName) ||
                DEFAULT_PARTY_NAME
              } profile`}
              width={profileImageSize}
              height={profileImageSize}
            />
            <div className="partyname-bubble">
              {(!worldUsersById[message.created_by]?.anonMode &&
                worldUsersById[message.created_by]?.partyName) ||
                DEFAULT_PARTY_NAME}
            </div>
            <div
              className={`message-bubble ${
                message.reaction === "messageToTheBand" ? "" : "emoji"
              }`}
            >
              {!message.reaction || message.reaction === "messageToTheBand"
                ? message.text
                : ReactionsTextMap[message.reaction]}
            </div>
          </div>
        ))}
      </div>
      <UserProfileModal
        userProfile={selectedUserProfile}
        show={selectedUserProfile !== undefined}
        onHide={() => setSelectedUserProfile(undefined)}
      />
    </>
  );
};

export default ReactionList;
