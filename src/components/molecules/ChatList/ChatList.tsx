import React, { useCallback, useMemo, useState } from "react";
import { Modal } from "react-bootstrap";

import { User } from "types/User";

import { WithId } from "utils/id";
import { hasElements } from "utils/types";

import { PrivateChatMessage, RestrictedChatMessage } from "store/actions/Chat";
import UserProfileModal from "components/organisms/UserProfileModal";

import "./ChatList.scss";
import { ChatMessage } from "./ChatMessage";
import { sortBy } from "lodash";

interface ChatListProps {
  usersById: Record<string, User>;
  messages: WithId<RestrictedChatMessage | PrivateChatMessage>[];
  emptyListMessage?: string;
  allowDelete?: boolean;
  deleteMessage: (id: string) => Promise<void>;
  showSenderImage?: boolean;
}

const ChatList: React.FC<ChatListProps> = ({
  usersById,
  messages,
  allowDelete,
  emptyListMessage,
  deleteMessage,
  showSenderImage,
}) => {
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>();
  const [messageToDelete, setMessageToDelete] = useState<
    WithId<RestrictedChatMessage | PrivateChatMessage>
  >();

  const showUserProfile = useCallback(
    (message: RestrictedChatMessage | PrivateChatMessage) => {
      if (!usersById) {
        return;
      }
      setSelectedUserProfile({
        ...usersById[message.from],
        id: message.from,
      });
    },
    [usersById]
  );

  const toggleDeleteModal = useCallback((message) => {
    setMessageToDelete(message);
    setShowDeleteModal(true);
  }, []);

  const confirmDelete = useCallback(async () => {
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
  }, [deleteMessage, messageToDelete]);

  const cancelDelete = useCallback(() => {
    setError(undefined);
    setShowDeleteModal(false);
  }, []);

  const hideUserProfile = useCallback(
    () => setSelectedUserProfile(undefined),
    []
  );
  const hideDeleteModal = useCallback(() => setShowDeleteModal(false), []);

  const hasMessages = hasElements(messages);

  const messageSender = usersById?.[messageToDelete?.from ?? ""]?.partyName;

  const renderMessages = useMemo(() => {
    // Last (newest) message goes first
    const sortedMessages = sortBy(messages, ["ts_utc"]).reverse();

    return sortedMessages.map((message) => (
      <ChatMessage
        key={`${message.from}-${message.ts_utc.seconds}-${message.ts_utc.nanoseconds}`}
        usersById={usersById}
        message={message}
        allowDelete={allowDelete ?? false}
        onDeleteClick={toggleDeleteModal}
        onAvatarClick={showUserProfile}
        showSenderImage={showSenderImage}
      />
    ));
  }, [
    allowDelete,
    messages,
    showSenderImage,
    showUserProfile,
    toggleDeleteModal,
    usersById,
  ]);

  return (
    <>
      {hasMessages && (
        <div className="chat-messages-container">
          {usersById && renderMessages}
        </div>
      )}
      {!hasMessages && (
        <div className="chat-messages-empty">
          {emptyListMessage ?? "No private messages yet."}
        </div>
      )}
      <UserProfileModal
        userProfile={selectedUserProfile}
        show={selectedUserProfile !== undefined}
        onHide={hideUserProfile}
      />
      <Modal show={showDeleteModal} onHide={hideDeleteModal}>
        <div className="text-center">
          <p>{`Permanently delete message '${messageToDelete?.text}' from ${messageSender}?`}</p>
          <button
            type="button"
            disabled={deleting}
            className="btn btn-block btn-danger btn-centered"
            onClick={confirmDelete}
          >
            Yes, delete
          </button>
          {error && <span className="input-error">{error}</span>}
          <button
            disabled={deleting}
            className="btn btn-block btn-primary btn-centered"
            onClick={cancelDelete}
          >
            No, Cancel
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ChatList;
