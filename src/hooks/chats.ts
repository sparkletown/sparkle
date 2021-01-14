import { useFirestoreConnect } from "./useFirestoreConnect";

import { CHAT_TYPES } from "types/Chat";

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

  const selectTab = (chatType: CHAT_TYPES) => {};
  const selectedTab = "private";

  return {
    isChatOpened,

    openChat,
    closeChat,

    selectTab,
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
};
