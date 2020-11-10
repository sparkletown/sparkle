import React, { useState } from "react";
import { User } from "types/User";
import UserProfileModal from "components/organisms/UserProfileModal";
import {
  PrivateChatMessage,
  RestrictedChatMessage,
} from "components/context/ChatContext";
import { useSelector } from "hooks/useSelector";
import { WithId } from "utils/id";
import { Modal } from "react-bootstrap";
import { useFirestoreConnect } from "react-redux-firebase";
import { useVenueId } from "hooks/useVenueId";
import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";
import { formatUtcSeconds } from "utils/time";
import { getLinkFromText } from "utils/getLinkFromText";
import { useUser } from "hooks/useUser";
import "./MessageList.scss";

interface MessageListProps {
  messages: WithId<RestrictedChatMessage | PrivateChatMessage>[];
  emptyListMessage?: string;
  allowDelete?: boolean;
  deleteMessage: (id: string) => Promise<void>;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  allowDelete,
  emptyListMessage,
  deleteMessage,
}) => {
  const venueId = useVenueId();
  useFirestoreConnect({
    collection: "users",
    where: ["enteredVenueIds", "array-contains", venueId],
    storeAs: "chatUsers",
  });
  const { user } = useUser();
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

  return (
    <>
      {!!messages.length && (
        <div className="chat-messages-container">
          {usersById &&
            messages.map(
              (message: WithId<RestrictedChatMessage | PrivateChatMessage>) => {
                const sender = { ...usersById[message.from], id: message.from };
                const profileImageSize = 30;
                const isMe = sender.id === user!.uid;
                return (
                  <React.Fragment
                    key={`${message.from}-${message.to}-${message.ts_utc}`}
                  >
                    {message.from in usersById && (
                      <>
                        <div
                          className={`message chat-message ${
                            isMe ? "chat-message_own" : ""
                          }`}
                          key={`${message.from}-${message.ts_utc}`}
                        >
                          <div className="chat-message-bubble">
                            {getLinkFromText(message.text)}
                          </div>
                          <div className="chat-message-author">
                            <img
                              onClick={() => {
                                setSelectedUserProfile({
                                  ...usersById[message.from],
                                  id: message.from,
                                });
                              }}
                              key={`${message.from}-messaging-the-band`}
                              className="chat-message-avatar"
                              src={
                                (!sender.anonMode && sender.pictureUrl) ||
                                DEFAULT_PROFILE_IMAGE
                              }
                              title={
                                (!sender.anonMode && sender.partyName) ||
                                DEFAULT_PARTY_NAME
                              }
                              alt={`${
                                (!sender.anonMode && sender.partyName) ||
                                DEFAULT_PARTY_NAME
                              } profile`}
                              width={profileImageSize}
                              height={profileImageSize}
                            />
                            <div className="chat-message-pseudo">
                              {(!sender.anonMode && sender.partyName) ||
                                DEFAULT_PARTY_NAME}{" "}
                              <span className="timestamp">
                                {formatUtcSeconds(message.ts_utc)}
                              </span>
                            </div>
                            {allowDelete && (
                              <div
                                className="chat-message-delete"
                                onClick={() => {
                                  setMessageToDelete(message);
                                  setShowDeleteModal(true);
                                }}
                              ></div>
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </React.Fragment>
                );
              }
            )}
        </div>
      )}
      {!messages.length && (
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
          <p>
            Permanently delete message &quot;{messageToDelete?.text}&quot; from{" "}
            {usersById?.[messageToDelete?.from ?? ""]?.partyName}?
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
