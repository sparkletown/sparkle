import React, { useState } from "react";
import "./PrivateChatModal.scss";
import { useSelector } from "react-redux";
import { PrivateChatMessage } from "components/context/ChatContext";
import UserProfilePicture from "components/molecules/UserProfilePicture";
import Chatbox from "components/organisms/Chatbox";
import { formatUtcSeconds } from "utils/time";
import { User } from "types/User";
import { setPrivateChatMessageIsRead } from "./helpers";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface LastMessageByUser {
  [userId: string]: PrivateChatMessage;
}

const PrivateChatModal: React.FunctionComponent = () => {
  const { privateChats, users, user } = useSelector((state: any) => ({
    privateChats: state.firestore.ordered.privatechats,
    users: state.firestore.data.users,
    user: state.user,
  }));
  const [selectedUser, setSelectedUser] = useState<User>();

  const discussionPartnerWithLastMessageExchanged = privateChats.reduce(
    (agg: LastMessageByUser, item: PrivateChatMessage) => {
      let lastMessageTimeStamp;
      let discussionPartner;
      if (item.from === user.uid) {
        discussionPartner = item.to;
      } else {
        discussionPartner = item.from;
      }
      try {
        lastMessageTimeStamp = agg[discussionPartner].ts_utc;
        if (lastMessageTimeStamp < item.ts_utc) {
          agg[discussionPartner] = item;
        }
      } catch {
        agg[discussionPartner] = item;
      }
      return agg;
    },
    {}
  );

  const onClickOnSender = (sender: User) => {
    const chatsToUpdate = privateChats.filter(
      (chat: PrivateChatMessage) => !chat.isRead && chat.from === sender.id
    );
    chatsToUpdate.map((chat: PrivateChatMessage & { id: string }) =>
      setPrivateChatMessageIsRead(user.uid, chat.id)
    );
    setSelectedUser(sender);
  };

  return (
    <div className="private-chat-modal-container">
      {selectedUser ? (
        <div className="chat-container">
          <div
            className="back-button"
            onClick={() => setSelectedUser(undefined)}
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
          <Chatbox
            discussionPartner={selectedUser}
            isInProfileModal
            displayNameOfDiscussionPartnerAsTitle
          />
        </div>
      ) : (
        discussionPartnerWithLastMessageExchanged && (
          <>
            <h2 className="private-chat-title">Private Chat</h2>
            {Object.keys(discussionPartnerWithLastMessageExchanged)
              .sort(
                (a, b) =>
                  discussionPartnerWithLastMessageExchanged[b].ts_utc -
                  discussionPartnerWithLastMessageExchanged[a].ts_utc
              )
              .map((userId: string) => {
                const sender = { ...users[userId], id: userId };
                const lastMessageExchanged =
                  discussionPartnerWithLastMessageExchanged[userId];
                return (
                  <div
                    key={userId}
                    className="private-message-sender"
                    onClick={() => onClickOnSender(sender)}
                  >
                    <UserProfilePicture
                      user={sender}
                      setSelectedUserProfile={() => null}
                      imageSize={50}
                    />
                    <div className="sender-info-container">
                      <div className="sender-party-name">
                        {sender.partyName}
                      </div>
                      <div className="sender-last-message">
                        {lastMessageExchanged.text}
                      </div>
                      <div>{formatUtcSeconds(lastMessageExchanged.ts_utc)}</div>
                    </div>
                    {lastMessageExchanged.from !== user.uid &&
                      !lastMessageExchanged.isRead && (
                        <div className="not-read-indicator" />
                      )}
                  </div>
                );
              })}
          </>
        )
      )}
    </div>
  );
};

export default PrivateChatModal;
