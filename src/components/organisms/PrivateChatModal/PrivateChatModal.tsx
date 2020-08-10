import React, { useState } from "react";
import "./PrivateChatModal.scss";
import { PrivateChatMessage } from "components/context/ChatContext";
import UserProfilePicture from "components/molecules/UserProfilePicture";
import Chatbox from "components/organisms/Chatbox";
import { formatUtcSeconds } from "utils/time";
import { User } from "types/User";
import { setPrivateChatMessageIsRead } from "./helpers";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PrivateRecipientSearchInput from "components/molecules/PrivateRecipientSearchInput";
import { useUser } from "hooks/useUser";
import { useSelector } from "hooks/useSelector";
import useConnectRecentUsers from "hooks/useConnectRecentUsers";
import { WithId } from "utils/id";

interface LastMessageByUser {
  [userId: string]: PrivateChatMessage;
}

const PrivateChatModal: React.FunctionComponent = () => {
  useConnectRecentUsers();

  const { user } = useUser();
  const { privateChats, users } = useSelector((state) => ({
    privateChats: state.firestore.ordered.privatechats,
    users: state.firestore.data.users,
  }));

  const [selectedUser, setSelectedUser] = useState<WithId<User>>();

  const discussionPartnerWithLastMessageExchanged =
    privateChats &&
    privateChats.reduce<LastMessageByUser>((agg, item) => {
      let lastMessageTimeStamp;
      let discussionPartner;
      if (item.from === user?.uid) {
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
    }, {});

  const onClickOnSender = (sender: WithId<User>) => {
    const chatsToUpdate = privateChats.filter(
      (chat) => !chat.isRead && chat.from === sender.id
    );
    chatsToUpdate.map(
      (chat) => user && setPrivateChatMessageIsRead(user.uid, chat.id)
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
            id="private-chat-back-button"
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
            <PrivateRecipientSearchInput setSelectedUser={setSelectedUser} />
            {Object.keys(discussionPartnerWithLastMessageExchanged)
              .sort((a, b) =>
                discussionPartnerWithLastMessageExchanged[b].ts_utc
                  .valueOf()
                  .localeCompare(
                    discussionPartnerWithLastMessageExchanged[
                      a
                    ].ts_utc.valueOf()
                  )
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
                    id="private-chat-modal-select-private-recipient"
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
                    {lastMessageExchanged.from !== user?.uid &&
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
