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
  getPreviewChatMessage,
  partitionMessagesFromReplies,
  getMessageReplies,
  getBaseMessageToDisplay,
} from "utils/chat";
import { WithId, withId } from "utils/id";
import { isTruthy } from "utils/types";

import {
  DeleteMessage,
  PreviewChatMessageMap,
  PrivateChatMessage,
  SendChatReply,
  SendMessage,
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

  const sendMessageToSelectedRecipient: SendMessage = useCallback(
    ({ message, isQuestion }) => {
      if (!userId) return;

      const privateChatMessage = buildMessage<PrivateChatMessage>({
        from: userId,
        text: message,
        isQuestion,
        to: recipientId,
      });

      return sendPrivateMessage(privateChatMessage);
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
    () => partitionMessagesFromReplies(filteredMessages),
    [filteredMessages]
  );

  const messagesToDisplay = useMemo(
    () =>
      messages
        .map((message) => {
          const displayMessage = getBaseMessageToDisplay<
            WithId<PrivateChatMessage>
          >({
            message,
            usersById: worldUsersById,
            myUserId: userId,
          });

          if (!displayMessage) return undefined;

          const messageReplies = getMessageReplies<PrivateChatMessage>({
            messageId: message.id,
            allReplies: allMessagesReplies,
          })
            .map((reply) =>
              getBaseMessageToDisplay<WithId<PrivateChatMessage>>({
                message: reply,
                usersById: worldUsersById,
                myUserId: userId,
              })
            )
            .filter(isTruthy);

          return { ...displayMessage, replies: messageReplies };
        })
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
