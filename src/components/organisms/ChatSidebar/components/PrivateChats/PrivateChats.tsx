import React, { useMemo } from "react";

import { PrivateChatPreview, RecipientChat } from "./components";

import { OnAvatarClick } from "types/User";

import { usePrivateChatList } from "hooks/usePrivateChats";
import { useChatsSidebarControls } from "hooks/useChatsSidebar";

import "./PrivateChats.scss";

export interface PrivateChatsProps {
  recipientId?: string;
  onAvatarClick: OnAvatarClick;
}

export const PrivateChats: React.FC<PrivateChatsProps> = ({
  recipientId,
  onAvatarClick,
}) => {
  // const [userSearchQuery, setUserSearchQuery] = useState("");

  const { privateChatList } = usePrivateChatList();
  const { openPrivateRecipientChat } = useChatsSidebarControls();

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
    [privateChatList, openPrivateRecipientChat]
  );

  if (recipientId) {
    return (
      <RecipientChat recipientId={recipientId} onAvatarClick={onAvatarClick} />
    );
  }

  return (
    <div className="private-chats-container">
      {/* <input className="private-chats-search" placeholder="Search for people" /> */}
      <div>{renderedPrivateChatPreviews}</div>
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
