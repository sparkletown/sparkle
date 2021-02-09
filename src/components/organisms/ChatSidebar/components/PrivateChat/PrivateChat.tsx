import React, { useState, useMemo } from "react";

// import { Chat } from "components/organisms/Chat";

import { PrivateChatList, OnlineUserList } from "./components";

import { usePrivateChat } from "hooks/chats";
import { isEmpty } from "lodash";

const useRecentUniverseUsers = () => ({ recentUniverseUsers: [] });

export const PrivateChat: React.FC = () => {
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const {
    sendMessageToSelectedUser,
    setSelectedUser,
    selectedUser,
    privateChatList,
    // chatMessages,
  } = usePrivateChat();

  const { recentUniverseUsers } = useRecentUniverseUsers();

  // const groomedPrivateChatList = useMemo(
  //   () =>
  //     userSearchQuery
  //       ? privateChatList
  //           .filter((chat) => chat.user.name.includes(userSearchQuery))
  //           .sort()
  //       : privateChatList,
  //   [privateChatList, userSearchQuery]
  // );

  // const groomedOnlineUserList = useMemo(
  //   () =>
  //     userSearchQuery
  //       ? recentUniverseUsers
  //           .filter((user) => user.name.includes(userSearchQuery))
  //           .sort()
  //       : recentUniverseUsers,
  //   [recentUniverseUsers, userSearchQuery]
  // );

  if (selectedUser) {
    return null;
    // (
    // <Chat
    // sendMessage={sendMessageToSelectedUser}
    // chatMessages={chatMessages}
    // />
    // );
  }

  return null;

  // return (
  //   <div className="chat-list-wrapper">
  //     {!isEmpty(groomedPrivateChatList) && (
  //       <PrivateChatList privateChatList={groomedPrivateChatList} onChatClick />
  //     )}
  //     {!isEmpty(groomedOnlineUserList) && (
  //       <OnlineUserList onlineUserList={groomedOnlineUserList} onUserClick />
  //     )}
  //   </div>
  // );
};
