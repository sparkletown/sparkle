import React, { useState, useMemo } from "react";

import { PrivateChatList, OnlineUserList, RecipientChat } from "./components";

import { usePrivateChatList } from "hooks/usePrivateChats";

export interface PrivateChatsProps {
  recipientId?: string;
}

export const PrivateChats: React.FC<PrivateChatsProps> = ({ recipientId }) => {
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const {
    // sendMessageToSelectedUser,
    // setSelectedRecipient,
    // selectedRecipient,
    // privateChatList,
    // chatMessages,
  } = usePrivateChatList();

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

  if (recipientId) {
    return <RecipientChat recipientId={recipientId} />;
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
