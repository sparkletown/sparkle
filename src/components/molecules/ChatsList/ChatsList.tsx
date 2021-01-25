import React, { Fragment, useCallback, useMemo, useState } from "react";
import { isEmpty } from "lodash";
import { formatDistanceToNow } from "date-fns";

import {
  DEFAULT_PARTY_NAME,
  NUM_CHAT_UIDS_TO_LOAD,
  VENUE_CHAT_AGE_DAYS,
  DOCUMENT_ID,
} from "settings";

import { User } from "types/User";

import { getDaysAgoInSeconds, roundToNearestHour } from "utils/time";
import { WithId } from "utils/id";
import { chatUsersSelector, privateChatsSelector } from "utils/selectors";
import { hasElements, isTruthy } from "utils/types";

import { useSelector } from "hooks/useSelector";
import { useUser } from "hooks/useUser";
import { useDispatch } from "hooks/useDispatch";
import { useFirestoreConnect } from "hooks/useFirestoreConnect";

import { PrivateChatMessage, sendPrivateChat } from "store/actions/Chat";
import { chatSort } from "utils/chat";
import UserProfilePicture from "components/molecules/UserProfilePicture";
import ChatBox from "components/molecules/Chatbox";
import { setPrivateChatMessageIsRead } from "components/molecules/ChatsList/helpers";
import UserSearchBar from "../UserSearchBar/UserSearchBar";

import "./ChatsList.scss";

import { filterUniqueKeys } from "utils/filterUniqueKeys";

interface LastMessageByUser {
  [userId: string]: PrivateChatMessage;
}

const DAYS_AGO = getDaysAgoInSeconds(VENUE_CHAT_AGE_DAYS);
const HIDE_BEFORE = roundToNearestHour(DAYS_AGO);

const noopHandler = () => {};

const ChatsList: React.FunctionComponent = () => {
  const { user } = useUser();
  const dispatch = useDispatch();

  const chatUsers = useSelector(chatUsersSelector) ?? {};

  const [selectedUser, setSelectedUser] = useState<WithId<User>>();

  const privateChats = useSelector(privateChatsSelector) ?? [];
  const chatUserIds = useMemo(() => {
    return [...privateChats]
      .sort(chatSort)
      .flatMap((chat) => [chat.from, chat.to])
      .filter(filterUniqueKeys)
      .slice(0, NUM_CHAT_UIDS_TO_LOAD);
  }, [privateChats]);

  useFirestoreConnect(
    hasElements(chatUserIds)
      ? {
          collection: "users",
          where: [DOCUMENT_ID, "in", chatUserIds],
          storeAs: "chatUsers",
        }
      : undefined
  );

  const lastMessageByUserReducer = useCallback(
    (agg, item) => {
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
    },
    [user]
  );

  const discussionPartnerWithLastMessageExchanged = useMemo(() => {
    if (!privateChats) return {};
    return privateChats.reduce<LastMessageByUser>(lastMessageByUserReducer, {});
  }, [lastMessageByUserReducer, privateChats]);

  const onClickOnSender = useCallback(
    (sender: WithId<User>) => {
      if (!privateChats) return;

      const chatsToUpdate = privateChats.filter(
        (chat) => !chat.isRead && chat.from === sender.id
      );
      chatsToUpdate.map(
        (chat) => user && setPrivateChatMessageIsRead(user.uid, chat.id)
      );
      setSelectedUser(sender);
    },
    [privateChats, user]
  );

  const chatsToDisplay = useMemo(
    () =>
      privateChats
        ?.filter(
          (message) =>
            message.deleted !== true &&
            message.type === "private" &&
            (message.to === selectedUser?.id ||
              message.from === selectedUser?.id) &&
            message.ts_utc.seconds > HIDE_BEFORE
        )
        .sort(chatSort) ?? [],
    [privateChats, selectedUser]
  );

  const submitMessage = useCallback(
    async (data: { messageToTheBand: string }) => {
      if (!user) return;

      return dispatch(
        sendPrivateChat({
          from: user.uid,
          to: selectedUser!.id,
          text: data.messageToTheBand,
        })
      );
    },
    [selectedUser, user, dispatch]
  );

  const hideUserChat = useCallback(() => setSelectedUser(undefined), []);

  const hasPrivateChats = !isEmpty(discussionPartnerWithLastMessageExchanged);

  const discussions = useMemo(() => {
    return Object.keys(discussionPartnerWithLastMessageExchanged).sort((a, b) =>
      discussionPartnerWithLastMessageExchanged[b].ts_utc
        .valueOf()
        .localeCompare(
          discussionPartnerWithLastMessageExchanged[a].ts_utc.valueOf()
        )
    );
  }, [discussionPartnerWithLastMessageExchanged]);

  const userUid = user?.uid;
  const privateMessageList = useMemo(() => {
    return discussions.map((userId: string) => {
      const sender = { ...chatUsers![userId], id: userId };
      const lastMessageExchanged =
        discussionPartnerWithLastMessageExchanged?.[userId];
      const isUnreadMessage = !isTruthy(lastMessageExchanged.isRead);
      const profileName = sender.anonMode
        ? DEFAULT_PARTY_NAME
        : sender.partyName;

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
            setSelectedUserProfile={noopHandler}
          />

          <div className="private-message-content">
            <div
              className={`private-message-author ${
                isUnreadMessage && "unread"
              }`}
            >
              {profileName}
            </div>
            <div
              className={`private-message-last ${isUnreadMessage && "unread"}`}
            >
              {lastMessageExchanged.text}
            </div>
          </div>

          {lastMessageExchanged.from !== userUid && (
            <div
              className={`private-message-time ${isUnreadMessage && "unread"}`}
            >
              {formatDistanceToNow(lastMessageExchanged.ts_utc.toDate())}
            </div>
          )}
        </div>
      );
    });
  }, [
    chatUsers,
    discussionPartnerWithLastMessageExchanged,
    discussions,
    onClickOnSender,
    userUid,
  ]);

  if (selectedUser) {
    return (
      <Fragment>
        <div className="private-container-back-btn" onClick={hideUserChat} />
        <div className="private-chat-user">
          Chatting with: {selectedUser.partyName}
        </div>
        <ChatBox chats={chatsToDisplay} onMessageSubmit={submitMessage} />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <UserSearchBar onSelect={setSelectedUser} />
      {hasPrivateChats && (
        <div className="private-container show">
          <div className="private-messages-list">{privateMessageList}</div>
        </div>
      )}
      {!hasPrivateChats && (
        <div className="private-messages-empty">
          <div>No private messages yet</div>
        </div>
      )}
    </Fragment>
  );
};

export default ChatsList;
