import React, { useState } from "react";
import { User } from "types/User";
import UserProfileModal from "components/organisms/UserProfileModal";
import "./ReactionList.scss";
import { RestrictedChatMessage } from "components/context/ChatContext";
import { useSelector } from "hooks/useSelector";
import { Message } from "./Message";

interface MessageListProps {
  messages: RestrictedChatMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const { usersById } = useSelector((state) => ({
    usersById: state.firestore.data.users,
  }));
  const [selectedUserProfile, setSelectedUserProfile] = useState<User>();

  return (
    <>
      <div className="reaction-list small">
        {messages.map((message) => (
          <>
            {message.from in usersById && (
              <Message
                sender={usersById[message.from]}
                message={message}
                onClick={() =>
                  setSelectedUserProfile({
                    ...usersById[message.from],
                    id: message.from, // @debt typing -  User is typed incorrectly so it thinks the id is in usersById
                  })
                }
              />
            )}
          </>
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
