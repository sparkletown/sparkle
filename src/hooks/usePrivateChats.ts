import { useMemo } from "react";

import { sendPrivateMessage } from "api/chat";

import { myPrivateChatsSelector } from "utils/selectors";
import { chatSort, buildMessage, getMessagesToDisplay } from "utils/chat";
import { filterUniqueKeys } from "utils/filterUniqueKeys";
import { hasElements } from "utils/types";

import { MessageToDisplay, PrivateChatMessage } from "types/chat";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";
import { useUser } from "./useUser";
import { useWorldUsersById } from "./users";

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

export const useMyPrivateChats = () => {
  useMyPrivateChatsConnect();

  const userPrivateChats = useSelector(myPrivateChatsSelector);

  return useMemo(
    () => ({
      userPrivateChats: userPrivateChats ?? [],
      isUserPrivateChatsLoaded: isLoaded(userPrivateChats),
    }),
    [userPrivateChats]
  );
};

export const usePrivateChatList = () => {
  const chatsToDisplay = [];
  const onlineUsers = [];

  return {};
};

export const useRecipientChat = (recipientId: string) => {
  const { worldUsersById } = useWorldUsersById();
  const { userPrivateChats } = useMyPrivateChats();
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
      userPrivateChats
        .filter(
          (message) =>
            message.deleted !== true &&
            (message.to === recipientId || message.from === recipientId)
        )
        .sort(chatSort)
        .map((message) =>
          getMessagesToDisplay(message, worldUsersById, userId)
        ),
    [userPrivateChats, recipientId]
  );

  const deleteMessage = () => {};

  return {
    sendMessageToSelectedRecipient,
    deleteMessage,
    messagesToDisplay,
    recipient,
  };
};
