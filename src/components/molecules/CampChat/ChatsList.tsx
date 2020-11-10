import React, { useContext, useMemo, useState } from "react";

// Components
import {
  ChatContext,
  PrivateChatMessage,
} from "components/context/ChatContext";
import UserProfilePicture from "components/molecules/UserProfilePicture";
import ChatBox from "./Chatbox";

// Hooks
import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";

// Utils | Settings | Constants
import { DEFAULT_PARTY_NAME, VENUE_CHAT_AGE_DAYS } from "settings";
import { getDaysAgoInSeconds } from "utils/time";
import { WithId } from "utils/id";

// Typings
import { User } from "types/User";

// Styles
import "./ChatsList.scss";
import { setPrivateChatMessageIsRead } from "components/organisms/PrivateChatModal/helpers";
import { isEmpty } from "lodash";

interface LastMessageByUser {
  [userId: string]: PrivateChatMessage;
}

const ChatsList: React.FunctionComponent = () => {
  const { user } = useUser();
  const { privateChats, chatUsers } = useSelector((state) => ({
    privateChats: state.firestore.ordered.privatechats,
    chatUsers: state.firestore.data.chatUsers,
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

  const roundToNearestHour = (seconds: number) => {
    const oneHour = 60 * 60;
    return Math.floor(seconds / oneHour) * oneHour;
  };
  const DAYS_AGO = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);
  const HIDE_BEFORE = roundToNearestHour(DAYS_AGO);

  const chatsToDisplay = useMemo(
    () =>
      privateChats &&
      privateChats
        .filter(
          (message) =>
            message.deleted !== true &&
            message.type === "private" &&
            (message.to === selectedUser?.id ||
              message.from === selectedUser?.id) &&
            message.ts_utc.seconds > HIDE_BEFORE
        )
        .sort((a, b) => b.ts_utc.valueOf().localeCompare(a.ts_utc.valueOf())),
    [privateChats, selectedUser, HIDE_BEFORE]
  );

  const chatContext = useContext(ChatContext);
  const onMessageSubmit = async (data: { messageToTheBand: string }) => {
    chatContext &&
      user &&
      chatContext.sendPrivateChat(
        user.uid,
        selectedUser!.id,
        data.messageToTheBand
      );
  };

  const hasPrivateChats = !isEmpty(discussionPartnerWithLastMessageExchanged);

  return selectedUser ? (
    <>
      <div
        className="private-container-back-btn"
        onClick={() => setSelectedUser(undefined)}
      />
      <ChatBox chats={chatsToDisplay} onMessageSubmit={onMessageSubmit} />
    </>
  ) : (
    <>
      {hasPrivateChats && (
        <div className="private-container show">
          <div className="private-messages-list">
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
                const sender = { ...chatUsers![userId], id: userId };
                const lastMessageExchanged =
                  discussionPartnerWithLastMessageExchanged?.[userId];
                return (
                  <div
                    key={userId}
                    className="private-message-item"
                    onClick={() => onClickOnSender(sender)}
                    id="private-chat-modal-select-private-recipient"
                  >
                    <UserProfilePicture
                      avatarClassName="private-message-author-pic"
                      user={sender}
                      setSelectedUserProfile={() => null}
                    />
                    <div className="private-message-content">
                      <div className="private-message-author">
                        {sender.anonMode
                          ? DEFAULT_PARTY_NAME
                          : sender.partyName}
                      </div>
                      <div className="private-message-last">
                        {lastMessageExchanged.text}
                      </div>
                      {/* <div>
                          {formatUtcSeconds(lastMessageExchanged.ts_utc)}
                        </div> */}
                    </div>
                    {lastMessageExchanged.from !== user?.uid &&
                      !lastMessageExchanged.isRead && (
                        <div className="not-read-indicator" />
                      )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
      {!hasPrivateChats && (
        <div className="private-messages-empty">
          <div>No private messages yet</div>
        </div>
      )}
    </>
  );
};

export default ChatsList;
