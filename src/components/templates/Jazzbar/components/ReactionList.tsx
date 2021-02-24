import React, { useState, useCallback } from "react";

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

import { setUserProfileModalVisibility } from "store/actions/UserProfile";
import { useDispatch } from "hooks/useDispatch";
import { useSelector } from "hooks/useSelector";
import { userProfileModalVisibilitySelector } from "utils/selectors";

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

  const dispatch = useDispatch();
  const isUserProfileModalVisible = useSelector(
    userProfileModalVisibilitySelector
  );
  const setUserProfileModalVisible = useCallback(() => {
    if (isUserProfileModalVisible) {
      setSelectedUserProfile(undefined);
    }
    dispatch(setUserProfileModalVisibility(!isUserProfileModalVisible));
  }, [dispatch, isUserProfileModalVisible]);

  const onUserProfile = useCallback(
    (user) => {
      setSelectedUserProfile(user);
      setUserProfileModalVisible();
    },
    [setSelectedUserProfile, setUserProfileModalVisible]
  );

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
                onUserProfile({
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
        show={isUserProfileModalVisible}
        onHide={setUserProfileModalVisible}
      />
    </>
  );
};

export default ReactionList;
