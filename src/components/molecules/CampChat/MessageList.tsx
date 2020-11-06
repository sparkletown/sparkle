import React, { useState } from "react";
import { User } from "types/User";
import UserProfileModal from "components/organisms/UserProfileModal";
import { RestrictedChatMessage } from "components/context/ChatContext";
import { Message } from "components/molecules/Message";
import { useSelector } from "hooks/useSelector";
import { WithId } from "utils/id";
import { Modal } from "react-bootstrap";
import { DEFAULT_PARTY_NAME, DEFAULT_PROFILE_IMAGE } from "settings";
import { formatUtcSeconds } from "utils/time";
import { getLinkFromText } from "utils/getLinkFromText";
import { useUser } from "hooks/useUser";

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
  const usersById = useSelector((state) => state.firestore.data.partygoers);
  const [selectedUserProfile, setSelectedUserProfile] = useState<
    WithId<User>
  >();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>();
  const [messageToDelete, setMessageToDelete] = useState<
    WithId<RestrictedChatMessage>
  >();
  const { user } = useUser();

  const profileImageSize = 30;
  return (
    <>
      <div className="reaction-list small">
        {usersById &&
          messages.map((message) => {
            const sender = { ...usersById[message.from], id: message.from };
            const isMe = user!.uid === sender.id;

            return (
              <React.Fragment
                key={`${message.from}-${message.to}-${message.ts_utc}`}
              >
                {message.from in usersById && (
                  <>
                    <div
                      className={`message chat-message ${isMe ? "isMe" : ""}`}
                      key={`${message.from}-${message.ts_utc}`}
                    >
                      <div
                        className={`message-bubble split-words ${
                          isMe ? "isMe" : ""
                        }`}
                      >
                        {getLinkFromText(message.text)}
                      </div>
                      <div className={`sender-info ${isMe ? "isMe" : ""}`}>
                        <img
                          onClick={() => {
                            setSelectedUserProfile({
                              ...usersById[message.from],
                              id: message.from, // @debt typing -  User is typed incorrectly so it thinks the id is in usersById
                            });
                          }}
                          key={`${message.from}-messaging-the-band`}
                          className="profile-icon"
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
                        <div>
                          {(!sender.anonMode && sender.partyName) ||
                            DEFAULT_PARTY_NAME}{" "}
                          <span className="timestamp">
                            {formatUtcSeconds(message.ts_utc)}
                          </span>
                          {allowDelete && (
                            <button
                              className="btn btn-small btn-danger delete-button"
                              onClick={() => {
                                setMessageToDelete(message);
                                setShowDeleteModal(true);
                              }}
                            >
                              Delete
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </React.Fragment>
            );
          })}
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
