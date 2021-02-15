import React, { useState, useMemo } from "react";

import {
  PrivateChatPreview,
  OnlineUserList,
  RecipientChat,
} from "./components";

import { usePrivateChatList } from "hooks/usePrivateChats";
import { useChatsSidebarControls } from "hooks/useChatsSidebar";

import "./PrivateChats.scss";

export interface PrivateChatsProps {
  recipientId?: string;
}

export const PrivateChats: React.FC<PrivateChatsProps> = ({ recipientId }) => {
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const { privateChatList } = usePrivateChatList();
  const { openPrivateRecipientChat } = useChatsSidebarControls();

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

  const renderedPrivateChatPreviews = useMemo(
    () =>
      privateChatList.map((chatMessage) => (
        <PrivateChatPreview
          {...chatMessage}
          onClick={() =>
            openPrivateRecipientChat(chatMessage.counterPartyUser.id)
          }
          key={`${chatMessage.ts_utc}-${chatMessage.from}-${chatMessage.to}`}
        />
      )),
    [privateChatList]
  );

  if (recipientId) {
    return <RecipientChat recipientId={recipientId} />;
  }

  console.log({ renderedPrivateChatPreviews });

  return (
    <div className="private-chats-container">
      {/* <input className="private-chats-search" placeholder="Search for people" /> */}
      <div>{renderedPrivateChatPreviews}</div>
      {/* <div>online users</div> */}
    </div>
  );

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
