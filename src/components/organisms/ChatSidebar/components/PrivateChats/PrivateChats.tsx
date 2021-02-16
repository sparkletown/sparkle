import React, { useMemo } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

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
      <div className="private-chats-search-container">
        <input
          className="private-chats-search-input"
          placeholder="Search for people"
        />
        <div className="private-chats-search-search-icon-container">
          <FontAwesomeIcon
            icon={faSearch}
            className="private-chats-search-search-icon"
            size="1x"
          />
        </div>
      </div>
      <div>{renderedPrivateChatPreviews}</div>
    </div>
  );
};
