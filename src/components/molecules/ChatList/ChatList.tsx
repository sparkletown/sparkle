import React, { useCallback, useState } from "react";
import { Modal } from "react-bootstrap";

import { User } from "types/User";

import { WithId } from "utils/id";

import { useSelector } from "hooks/useSelector";

import {
  PrivateChatMessage,
  RestrictedChatMessage,
} from "components/context/ChatContext";
import UserProfileModal from "components/organisms/UserProfileModal";

import "./ChatList.scss";
import { ChatMessage } from "./ChatMessage";

interface ChatListProps {
  messages: WithId<RestrictedChatMessage | PrivateChatMessage>[];
  emptyListMessage?: string;
  allowDelete?: boolean;
  deleteMessage: (id: string) => Promise<void>;
}

const ChatList: React.FC<ChatListProps> = ({
  messages,
  allowDelete,
  emptyListMessage,
  deleteMessage,
}) => {
  const usersById = useSelector((state) => state.firestore.data.chatUsers);
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>();
  const [messageToDelete, setMessageToDelete] = useState<
    WithId<RestrictedChatMessage | PrivateChatMessage>
  >();

  const onAvatarClick = useCallback(
    (message) => {
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

  const onDeleteClick = useCallback((message) => {
    setMessageToDelete(message);
    setShowDeleteModal(true);
  }, []);

  const onDeleteConfirm = useCallback(async () => {
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

  const onDeleteCancel = useCallback(() => {
    setError(undefined);
    setShowDeleteModal(false);
  }, []);

  const hasMessages = !!messages.length;
  const messageSender = usersById?.[messageToDelete?.from ?? ""]?.partyName;
  return (
    <>
      {hasMessages && (
        <div className="chat-messages-container">
          {usersById &&
            messages.map((message, index) => (
              <ChatMessage
                key={`chat-message-${index}`}
                usersById={usersById}
                message={message}
                allowDelete={allowDelete ?? false}
                onDeleteClick={onDeleteClick}
                onAvatarClick={onAvatarClick}
              />
            ))}
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
        onHide={() => setSelectedUserProfile(undefined)}
      />
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <div className="text-center">
          <p>{`Permanently delete message '${messageToDelete?.text}' from ${messageSender}?`}</p>
          <button
            type="button"
            disabled={deleting}
            className="btn btn-block btn-danger btn-centered"
            onClick={onDeleteConfirm}
          >
            Yes, delete
          </button>
          {error && <span className="input-error">{error}</span>}
          <button
            disabled={deleting}
            className="btn btn-block btn-primary btn-centered"
            onClick={onDeleteCancel}
          >
            No, Cancel
          </button>
        </div>
      </Modal>
    </>
  );
};

export default ChatList;
