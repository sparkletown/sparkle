import React, { useState } from "react";

// Components
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PrivateChatMessage } from "components/context/ChatContext";
import Chatbox from "components/organisms/Chatbox";
import UserProfilePicture from "components/molecules/UserProfilePicture";

// Hooks
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

// Utils | Settings | Constants
import { DEFAULT_PARTY_NAME } from "settings";
import { formatUtcSeconds } from "utils/time";
import { WithId } from "utils/id";

// Typings
import { User } from "types/User";

// Styles
import "./ChatsList.scss";
import { setPrivateChatMessageIsRead } from "components/organisms/PrivateChatModal/helpers";

interface LastMessageByUser {
  [userId: string]: PrivateChatMessage;
}

const ChatsList: React.FunctionComponent = () => {
  const { user } = useUser();
  const { privateChats, users } = useSelector((state) => ({
    privateChats: state.firestore.ordered.privatechats,
    users: state.firestore.data.partygoers,
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
    <div className="chats-modal-container">
      {selectedUser ? (
        <div className="chat-container">
          <div
            className="back-button"
            onClick={() => setSelectedUser(undefined)}
            id="chats-back-button"
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
                const sender = { ...users![userId], id: userId };
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
                    />
                    <div className="sender-info-container">
                      <div className="sender-party-name">
                        {sender.anonMode
                          ? DEFAULT_PARTY_NAME
                          : sender.partyName}
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

export default ChatsList;
