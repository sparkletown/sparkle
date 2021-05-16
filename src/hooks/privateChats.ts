import { useCallback, useMemo } from "react";

import {
  sendPrivateMessage,
  setChatMessageRead,
  deletePrivateMessage,
} from "api/chat";

import { privateChatMessagesSelector } from "utils/selectors";
import {
  chatSort,
  buildMessage,
  getPreviewChatMessageToDisplay,
  getMessageToDisplay,
  getPreviewChatMessage,
  divideMessages,
  getMessageReplies,
} from "utils/chat";
import { WithId, withId } from "utils/id";
import { isTruthy } from "utils/types";

import {
  DeleteMessage,
  PreviewChatMessageMap,
  PrivateChatMessage,
  SendMesssage,
  SendChatReply,
} from "types/chat";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";
import { useUser } from "./useUser";
import { useRecentWorldUsers, useWorldUsersById } from "./users";

export const useConnectPrivateChatMessages = () => {
  const { user } = useUser();

  useFirestoreConnect(() => {
    if (!user?.uid) return [];

    return [
      {
        collection: "privatechats",
        doc: user.uid,
        subcollections: [{ collection: "chats" }],
        storeAs: "privateChatMessages",
      },
    ];
  });
};

export const usePrivateChatMessages = () => {
  useConnectPrivateChatMessages();

  const privateChatMessages = useSelector(privateChatMessagesSelector);

  return useMemo(
    () => ({
      privateChatMessages: privateChatMessages ?? [],
      isUserPrivateChatsLoaded: isLoaded(privateChatMessages),
    }),
    [privateChatMessages]
  );
};

export const usePrivateChatPreviews = () => {
  const { user } = useUser();
  const { worldUsersById } = useWorldUsersById();
  const {
    privateChatMessages,
    isUserPrivateChatsLoaded,
  } = usePrivateChatMessages();

  const userId = user?.uid;

  const privateChatPreviewsMap = useMemo(
    () =>
      privateChatMessages.reduce<PreviewChatMessageMap>((acc, message) => {
        if (!userId) return acc;

        const { from: fromUserId, to: toUserId } = message;

        // Either `from` author or `to` author is Me. Filter me out
        const counterPartyUserId =
          fromUserId === userId ? toUserId : fromUserId;

        const counterPartyUser = worldUsersById[counterPartyUserId];

        // Filter out not existent users
        if (!counterPartyUser) return acc;

        if (counterPartyUserId in acc) {
          const previousMessage = acc[counterPartyUserId];

          // If the message is older, replace it with the more recent one
          if (previousMessage.ts_utc > message.ts_utc) return acc;

          return {
            ...acc,
            [counterPartyUserId]: getPreviewChatMessage({
              message,
              user: withId(counterPartyUser, counterPartyUserId),
            }),
          };
        }

        return {
          ...acc,
          [counterPartyUserId]: getPreviewChatMessage({
            message,
            user: withId(counterPartyUser, counterPartyUserId),
          }),
        };
      }, {}),
    [privateChatMessages, userId, worldUsersById]
  );

  return useMemo(
    () => ({
      privateChatPreviews: Object.values(privateChatPreviewsMap)
        .sort(chatSort)
        .map((message) =>
          getPreviewChatMessageToDisplay({ message, myUserId: userId })
        ),
      isPrivateChatPreviewsLoaded: isUserPrivateChatsLoaded,
    }),
    [privateChatPreviewsMap, userId, isUserPrivateChatsLoaded]
  );
};

export const useOnlineUsersToDisplay = () => {
  const { recentWorldUsers } = useRecentWorldUsers();
  const { user } = useUser();

  const userId = user?.uid;

  // Filter out self
  return useMemo(() => recentWorldUsers.filter((user) => user.id !== userId), [
    recentWorldUsers,
    userId,
  ]);
};

export const useNumberOfUnreadChats = () => {
  const { user } = useUser();
  const { privateChatPreviews } = usePrivateChatPreviews();

  const userId = user?.uid;

  return useMemo(
    () =>
      privateChatPreviews.filter(
        (chatPreview) => !chatPreview.isRead && chatPreview.from !== userId
      ).length,
    [privateChatPreviews, userId]
  );
};

export const useRecipientChat = (recipientId: string) => {
  const { worldUsersById } = useWorldUsersById();
  const { privateChatMessages } = usePrivateChatMessages();
  const { user } = useUser();

  const userId = user?.uid;
  const recipient = withId(worldUsersById[recipientId], recipientId);

  const sendMessageToSelectedRecipient: SendMesssage = useCallback(
    (text: string) => {
      if (!userId) return;

      const message = buildMessage<PrivateChatMessage>({
        from: userId,
        text,
        to: recipientId,
      });

      return sendPrivateMessage(message);
    },
    [userId, recipientId]
  );

  const deleteMessage: DeleteMessage = useCallback(
    (messageId: string) => {
      if (!userId) return;

      return deletePrivateMessage({ userId, messageId });
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

  const sendThreadReply: SendChatReply = useCallback(
    async ({ replyText, threadId }) => {
      if (!userId) return;

      const threadReply = buildMessage<PrivateChatMessage>({
        from: userId,
        to: recipientId,
        text: replyText,
        threadId,
      });

      return sendPrivateMessage(threadReply);
    },
    [userId, recipientId]
  );

  const filteredMessages = useMemo(
    () =>
      privateChatMessages
        .filter(
          (message) =>
            message.deleted !== true &&
            (message.to === recipientId || message.from === recipientId)
        )
        .sort(chatSort),
    [privateChatMessages, recipientId]
  );

  const { messages, allMessagesReplies } = useMemo(
    () => divideMessages(filteredMessages),
    [filteredMessages]
  );

  const messagesToDisplay = useMemo(
    () =>
      messages
        .map((message) =>
          getMessageToDisplay<WithId<PrivateChatMessage>>({
            message,
            usersById: worldUsersById,
            myUserId: userId,
            replies: getMessageReplies({
              messageId: message.id,
              allReplies: allMessagesReplies,
            }),
          })
        )
        .filter(isTruthy),
    [worldUsersById, userId, allMessagesReplies, messages]
  );

  return {
    sendMessageToSelectedRecipient,
    deleteMessage,
    markMessageRead,
    sendThreadReply,

    messagesToDisplay,
    recipient,
  };
};
