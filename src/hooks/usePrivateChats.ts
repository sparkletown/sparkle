import { useMemo } from "react";

import { myPrivateChatsSelector } from "utils/selectors";
import { chatSort } from "utils/chat";
import { filterUniqueKeys } from "utils/filterUniqueKeys";
import { hasElements } from "utils/types";

import { MessageToDisplay } from "types/chat";

import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";
import { useUser } from "./useUser";

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
  const { userPrivateChats } = useMyPrivateChats();

  const sendMessageToSelectedRecipient = (message: string) => {};

  const messagesToDisplay = [] as MessageToDisplay[];

  const deleteMessage = () => {};

  return {
    sendMessageToSelectedRecipient,
    deleteMessage,
    messages: messagesToDisplay,
  };
};
