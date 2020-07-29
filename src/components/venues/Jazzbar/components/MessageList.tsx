import React, { useState } from "react";
import { User } from "types/User";
import UserProfileModal from "components/organisms/UserProfileModal";
import "./ReactionList.scss";
import { RestrictedChatMessage } from "components/context/ChatContext";
import { DEFAULT_PROFILE_IMAGE } from "settings";
import { useSelector } from "hooks/useSelector";

interface MessageListProps {
  messages: RestrictedChatMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { usersById } = useSelector((state) => ({
    usersById: state.firestore.data.users,
  }));
  const [selectedUserProfile, setSelectedUserProfile] = useState<User>();

  const profileImageSize = 40;
  return (
    <>
      <div className="reaction-list small">
        {messages.map((message) => (
          <div className="message" key={`${message.from}-${message.ts_utc}`}>
            <img
              onClick={() =>
                setSelectedUserProfile({
                  ...usersById[message.from],
                  id: message.from,
                })
              }
              key={`${message.from}-messaging-the-band`}
              className="profile-icon"
              src={usersById[message.from].pictureUrl || DEFAULT_PROFILE_IMAGE}
              title={usersById[message.from].partyName}
              alt={`${usersById[message.from].partyName} profile`}
              width={profileImageSize}
              height={profileImageSize}
            />
            <div className="message-bubble">{message.text}</div>
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

export default MessageList;
