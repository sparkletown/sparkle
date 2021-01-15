import { isLoaded, useFirestoreConnect } from "./useFirestoreConnect";
import { useSelector } from "./useSelector";
import { useUser } from "./useUser";

import { CHAT_TYPES } from "types/Chat";
import {
  userPrivateChatsSelector,
  chatUsersByIdSelector,
} from "utils/selectors";
import { useMemo } from "react";
import { chatSort } from "utils/chat";
import { filterUniqueKeys } from "utils/filterUniqueKeys";
import { DOCUMENT_ID, NUM_CHAT_UIDS_TO_LOAD } from "settings";
import { hasElements } from "utils/types";

export const useConnectVenueChat = (venueId?: string) => {
  useFirestoreConnect(
    venueId
      ? {
          collection: "venues",
          doc: venueId,
          subcollections: [{ collection: "chats" }],
          storeAs: "venueChats",
        }
      : undefined
  );
};

export const useChatControls = () => {
  const openChat = (chatOptions?: {
    chatType: CHAT_TYPES;
    userId: "USER_ID";
  }) => {};
  const closeChat = () => {};

  const isChatOpened = true;

  const setSelectedTab = (chatType: CHAT_TYPES) => {};
  const selectedTab = "private";

  return {
    isChatOpened,

    openChat,
    closeChat,

    setSelectedTab,
    selectedTab,
  };
};

export const useChatInfo = () => {
  return {
    worldChatTabTitle: "World chat",
    privateChatTabTitle: "Private Chat",
    venueChatTabTitle: "Venue Chat",
  };
};

export const useUserChatsConnect = () => {
  const { user } = useUser();

  useFirestoreConnect(() => {
    if (!user?.uid) return [];

    return [
      {
        collection: "privatechats",
        doc: user.uid,
        subcollections: [{ collection: "chats" }],
        storeAs: "userPrivateChats",
      },
    ];
  });
};

export const useUserChats = () => {
  useUserChatsConnect();

  const userChats = useSelector(userPrivateChatsSelector);

  return useMemo(
    () => ({
      userChats: userChats ?? [],
      isUserChatsLoaded: isLoaded(userChats),
    }),
    [userChats]
  );
};

// @debt We can replace this by worldUsersById since we already fetch them
export const useChatUsersByIdConnect = () => {
  const { userChats } = useUserChats();

  const chatUserIds = useMemo(() => {
    return [...userChats]
      .sort(chatSort)
      .flatMap((chat) => [chat.from, chat.to])
      .filter(filterUniqueKeys)
      .slice(0, NUM_CHAT_UIDS_TO_LOAD);
  }, [userChats]);

  useFirestoreConnect(() => {
    if (!hasElements(chatUserIds)) return [];

    return [
      {
        collection: "users",
        where: [DOCUMENT_ID, "in", chatUserIds],
        storeAs: "chatUsers",
      },
    ];
  });
};

export const useChatUsersById = () => {
  useChatUsersByIdConnect();

  const chatUsersById = useSelector(chatUsersByIdSelector);

  return useMemo(
    () => ({
      chatUsersById: chatUsersById ?? {},
      isChatUsersByIdLoaded: isLoaded(chatUsersById),
    }),
    []
  );
};

// NOTE: Implement after we have world concept created;
export const useWorldChat = () => {};

export const useVenueChat = () => {};

export const usePrivateChat = () => {
  // useFirestoreConnect(
  //   user && user.uid
  //     ? {
  //         collection: "privatechats",
  //         doc: user.uid,
  //         subcollections: [{ collection: "chats" }],
  //         storeAs: "privatechats",
  //       }
  //     : undefined
  // );
  // const venueId = useVenueId();
  // useConnectVenueChats(venueId);
  // const chats = useSelector(venueChatsSelector);
  // const privateChats = useSelector(privateChatsSelector);

  const selectedUser = {};

  const sendMessageToSelectedUser = (message: string) => {
    //   if (!user) return;
    //   return dispatch(
    //     sendPrivateChat({
    //       from: user.uid,
    //       to: selectedUser!.id,
    //       text: data.messageToTheBand,
    //     })
    //   );
    // },
  };

  const setSelectedUser = () => {};

  const privateChatList = [{ user: {}, lastMessage: {} }];

  return {
    sendMessageToSelectedUser,
    setSelectedUser,
    selectedUser,
    privateChatList,
  };
};
