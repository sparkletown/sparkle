import { useMemo } from "react";

import { sendPrivateMessage } from "api/chat";

import { myPrivateChatsSelector } from "utils/selectors";
import {
  chatSort,
  buildMessage,
  getPreviewChatMessageToDisplay,
  getMessageToDisplay,
} from "utils/chat";
// import { filterUniqueKeys } from "utils/filterUniqueKeys";
// import { hasElements } from "utils/types";

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

        // NOTE: Either `from` author or `to` author is Me. Filter me out
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
            [counterPartyUserId]: { ...message, counterPartyUserId },
          };
        }

        return {
          ...acc,
          [counterPartyUserId]: { ...message, counterPartyUserId },
        };
      }, {}),
    [myPrivateMessages, userId]
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

export const useRecipientChat = (recipientId: string) => {
  const { worldUsersById } = useWorldUsersById();
  const { myPrivateMessages } = useMyPrivateMessages();
  const { user } = useUser();

  const userId = user?.uid;
  const recipient = worldUsersById[recipientId];

  const sendMessageToSelectedRecipient = (text: string) => {
    if (!userId) return;

    const message = buildMessage<PrivateChatMessage>({
      from: userId,
      text,
      to: recipientId,
    });

    sendPrivateMessage(message);
  };

  const messagesToDisplay = useMemo(
    () =>
      myPrivateMessages
        .filter(
          (message) =>
            message.deleted !== true &&
            (message.to === recipientId || message.from === recipientId)
        )
        .sort(chatSort)
        .map((message) => getMessageToDisplay(message, worldUsersById, userId)),
    [myPrivateMessages, recipientId]
  );

  const deleteMessage = () => {};

  return {
    sendMessageToSelectedRecipient,
    deleteMessage,
    messagesToDisplay,
    recipient,
  };
};
