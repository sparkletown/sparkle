import { useCallback, useMemo } from "react";

import {
  sendPrivateMessage,
  setChatMessageRead,
  deletePrivateMessage,
} from "api/chat";

import { myPrivateChatsSelector } from "utils/selectors";
import {
  chatSort,
  buildMessage,
  getPreviewChatMessageToDisplay,
  getMessageToDisplay,
} from "utils/chat";
import { WithId } from "utils/id";

import { PreviewChatMessage, PrivateChatMessage } from "types/chat";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";
import { useUser } from "./useUser";
import { useWorldUsersById } from "./users";

export type ChatToDisplay = {};

export const useMyPrivateChatsConnect = () => {
  const { user } = useUser();

  useFirestoreConnect(() => {
    if (!user?.uid) return [];

    return [
      {
        collection: "privatechats",
        doc: user.uid,
        subcollections: [{ collection: "chats" }],
        storeAs: "myPrivateChats",
      },
    ];
  });
};

export const useMyPrivateMessages = () => {
  useMyPrivateChatsConnect();

  const myPrivateMessages = useSelector(myPrivateChatsSelector);

  return useMemo(
    () => ({
      myPrivateMessages: myPrivateMessages ?? [],
      isUserPrivateChatsLoaded: isLoaded(myPrivateMessages),
    }),
    [myPrivateMessages]
  );
};

export const usePrivateChatList = () => {
  const { user } = useUser();
  const { worldUsersById } = useWorldUsersById();
  const { myPrivateMessages } = useMyPrivateMessages();

  const userId = user?.uid;

  const recentPreviewChatMessagesMap = useMemo(
    () =>
      myPrivateMessages.reduce<{
        [key: string]: PreviewChatMessage;
      }>((acc, message) => {
        if (!userId) return acc;

        const { from: fromUserId, to: toUserId } = message;

        // Either `from` author or `to` author is Me. Filter me out
        const counterPartyUserId =
          fromUserId === userId ? toUserId : fromUserId;

        // NOTE: Filter out not existent users
        if (!worldUsersById[counterPartyUserId]) return acc;

        if (counterPartyUserId in acc) {
          const previousMessage = acc[counterPartyUserId];

          // NOTE: If the message is older, replace it with the more recent one
          if (previousMessage.ts_utc > message.ts_utc) return acc;

          return {
            ...acc,
            [counterPartyUserId]: withId(message, counterPartyUserId),
          };
        }

        return {
          ...acc,
          [counterPartyUserId]: { ...message, counterPartyUserId },
        };
      }, {}),
    [myPrivateMessages, userId, worldUsersById]
  );

  return useMemo(
    () => ({
      privateChatList: Object.values(recentPreviewChatMessagesMap)
        .sort(chatSort)
        .map((message) =>
          getPreviewChatMessageToDisplay(message, worldUsersById, userId)
        ),
    }),
    [recentPreviewChatMessagesMap, worldUsersById, userId]
  );
};

export const useNumberOfUnreadChats = () => {
  const { user } = useUser();
  const { privateChatList } = usePrivateChatList();

  const userId = user?.uid;

  return useMemo(
    () =>
      privateChatList.filter(
        (chatMessage) => !chatMessage.isRead && chatMessage.from !== userId
      ).length,
    [privateChatList, userId]
  );
};

export const useRecipientChat = (recipientId: string) => {
  const { worldUsersById } = useWorldUsersById();
  const { myPrivateMessages } = useMyPrivateMessages();
  const { user } = useUser();

  const userId = user?.uid;
  const recipient = worldUsersById[recipientId];

  const sendMessageToSelectedRecipient = useCallback(
    (text: string) => {
      if (!userId) return;

      const message = buildMessage<PrivateChatMessage>({
        from: userId,
        text,
        to: recipientId,
      });

      sendPrivateMessage(message);
    },
    [userId, recipientId]
  );

  const messagesToDisplay = useMemo(
    () =>
      myPrivateMessages
        .filter(
          (message) =>
            message.deleted !== true &&
            (message.to === recipientId || message.from === recipientId)
        )
        .sort(chatSort)
        .map((message) =>
          getMessageToDisplay<WithId<PrivateChatMessage>>({
            message,
            usersById: worldUsersById,
            myUserId: userId,
          })
        ),
    [myPrivateMessages, recipientId, worldUsersById, userId]
  );

  const deleteMessage = useCallback(
    (messageId: string) => {
      if (!userId) return;

      deletePrivateMessage({ userId, messageId });
    },
    [userId]
  );

  const markMessageRead = useCallback(
    (messageId: string) => {
      if (!userId) return;

      setChatMessageRead({ userId, messageId });
    },
    [userId]
  );

  return {
    sendMessageToSelectedRecipient,
    deleteMessage,
    markMessageRead,
    messagesToDisplay,
    recipient,
  };
};
