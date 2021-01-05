import React, { useState } from "react";
import { User } from "types/User";
import UserProfileModal from "components/organisms/UserProfileModal";
import { RestrictedChatMessage } from "store/actions/Chat";
import { Message } from "components/molecules/Message";
import { useUsersById } from "hooks/users";
import { WithId } from "utils/id";
import { Modal } from "react-bootstrap";

interface MessageListProps {
  messages: WithId<RestrictedChatMessage>[];
  allowDelete: boolean;
  deleteMessage: (id: string) => Promise<void>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  allowDelete,
  deleteMessage,
}) => {
  const usersById = useUsersById();
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>();
  const [messageToDelete, setMessageToDelete] = useState<
    WithId<RestrictedChatMessage>
  >();

  return (
    <>
      <div className="reaction-list small">
        {messages.map((message) => (
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
                onDelete={() => {
                  setMessageToDelete(message);
                  setShowDeleteModal(true);
                }}
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
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <div className="text-center">
          <p>
            Permanently delete message &quot;{messageToDelete?.text}&quot; from{" "}
            {usersById[messageToDelete?.from ?? ""]?.partyName}?
          </p>
          <button
            type="button"
            disabled={deleting}
            className="btn btn-block btn-danger btn-centered"
            onClick={async () => {
              if (messageToDelete) {
                setDeleting(true);
                try {
                  await deleteMessage(messageToDelete.id);
                  setShowDeleteModal(false);
                } catch (e) {
                  setError(e.toString());
                } finally {
                  setDeleting(false);
                }
              }
            }}
          >
            Yes, delete
          </button>
          {error && <span className="input-error">{error}</span>}
          <button
            disabled={deleting}
            className="btn btn-block btn-primary btn-centered"
            onClick={() => {
              setError(undefined);
              setShowDeleteModal(false);
            }}
          >
            No, Cancel
          </button>
        </div>
      </Modal>
    </>
  );
};
