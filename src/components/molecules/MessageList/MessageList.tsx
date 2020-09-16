import React, { useState } from "react";
import { User } from "types/User";
import UserProfileModal from "components/organisms/UserProfileModal";
import { RestrictedChatMessage } from "components/context/ChatContext";
import { Message } from "components/molecules/Message";
import { useSelector } from "hooks/useSelector";
import { WithId } from "utils/id";

interface MessageListProps {
  messages: WithId<RestrictedChatMessage>[];
  allowDelete: boolean;
  deleteMessage: (id: string) => void;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  allowDelete,
  deleteMessage,
}) => {
  const usersById = useSelector((state) => state.firestore.data.partygoers);
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();

  return (
    <>
      <div className="reaction-list small">
        {usersById &&
          messages.map((message) => (
            <React.Fragment
              key={`${message.from}-${message.to}-${message.ts_utc}`}
            >
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
                  deletable={allowDelete}
                  onDelete={() =>
                    window.confirm(
                      `Are you sure you want to delete "${message.text}" from ${
                        usersById[message.from]
                      }?`
                    ) && deleteMessage(message.id)
                  }
                />
              )}
            </React.Fragment>
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
