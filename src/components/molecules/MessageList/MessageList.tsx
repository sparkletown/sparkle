import React, { useState } from "react";
import { User } from "types/User";
import UserProfileModal from "components/organisms/UserProfileModal";
import { RestrictedChatMessage } from "components/context/ChatContext";
import { Message } from "components/molecules/Message";
import { useSelector } from "hooks/useSelector";

interface MessageListProps {
  messages: RestrictedChatMessage[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const usersById = useSelector((state) => state.firestore.data.users);
  const [selectedUserProfile, setSelectedUserProfile] = useState<User>();

  return (
    <>
      <div className="reaction-list small">
        {messages.map((message) => (
          <>
            {message.from in usersById && (
              <Message
                sender={{ ...usersById[message.from], id: message.from }}
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
