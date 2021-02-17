import React, { useCallback, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { PrivateChatPreview, RecipientChat, OnlineUser } from "./components";

import { OnAvatarClick } from "types/User";

import { usePrivateChatList } from "hooks/usePrivateChats";
import { useChatsSidebarControls } from "hooks/useChatsSidebar";
import { useRecentWorldUsers } from "hooks/users";

import "./PrivateChats.scss";

export interface PrivateChatsProps {
  recipientId?: string;
  onAvatarClick: OnAvatarClick;
}

export const PrivateChats: React.FC<PrivateChatsProps> = ({
  recipientId,
  onAvatarClick,
}) => {
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const onInputChage = useCallback(
    (e) => setUserSearchQuery(e.target.value),
    []
  );

  const { privateChatList } = usePrivateChatList();
  const { openPrivateRecipientChat } = useChatsSidebarControls();
  const { recentWorldUsers } = useRecentWorldUsers();

  const numberOfRecentWorldUsers = recentWorldUsers.length;

  const renderedPrivateChatPreviews = useMemo(
    () =>
      privateChatList.map((chatMessage) => (
        <PrivateChatPreview
          message={chatMessage}
          isOnline={recentWorldUsers.some(
            (user) => user.id === chatMessage.counterPartyUser.id
          )}
          onClick={() =>
            openPrivateRecipientChat(chatMessage.counterPartyUser.id)
          }
          key={`${chatMessage.ts_utc}-${chatMessage.from}-${chatMessage.to}`}
        />
      )),
    [privateChatList, openPrivateRecipientChat, recentWorldUsers]
  );

  const renderedOnlineUsers = useMemo(
    () =>
      recentWorldUsers.map((user) => (
        <OnlineUser
          key={user.id}
          user={user}
          onClick={() => openPrivateRecipientChat(user.id)}
        />
      )),
    [recentWorldUsers, openPrivateRecipientChat]
  );

  const renderedSearchResults = useMemo(
    () =>
      recentWorldUsers
        .filter((user) =>
          user.partyName?.toLowerCase().includes(userSearchQuery.toLowerCase())
        )
        .map((user) => (
          <OnlineUser
            key={user.id}
            user={user}
            onClick={() => openPrivateRecipientChat(user.id)}
          />
        )),
    [recentWorldUsers, openPrivateRecipientChat, userSearchQuery]
  );

  const numberOfSearchResults = renderedSearchResults.length;
  const hasChatPreviews = renderedPrivateChatPreviews.length > 0;

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
          placeholder="Search for online people"
          value={userSearchQuery}
          onChange={onInputChage}
        />
        <div className="private-chats-search-search-icon-container">
          <FontAwesomeIcon
            icon={faSearch}
            className="private-chats-search-search-icon"
            size="1x"
          />
        </div>
      </div>

      {userSearchQuery ? (
        <>
          <p className="private-chats-title-text">
            {numberOfSearchResults} search results
          </p>

          {renderedSearchResults}
        </>
      ) : (
        <>
          {hasChatPreviews && (
            <div className="private-chats-chat-previews">
              {renderedPrivateChatPreviews}
            </div>
          )}

          <p className="private-chats-title-text">
            {numberOfRecentWorldUsers} connected people
          </p>

          {renderedOnlineUsers}
        </>
      )}
    </div>
  );
};
