import React, { useCallback, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { PrivateChatPreview, RecipientChat, OnlineUser } from "../";

import { SetSelectedProfile } from "types/chat";

import {
  usePrivateChatPreviews,
  useOnlineUsersToDisplay,
} from "hooks/privateChats";
import { useChatSidebarControls } from "hooks/chatSidebar";

import "./PrivateChats.scss";

export interface PrivateChatsProps {
  recipientId?: string;
  onAvatarClick: SetSelectedProfile;
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

  const { privateChatPreviews } = usePrivateChatPreviews();
  const onlineUsers = useOnlineUsersToDisplay();
  const { selectRecipientChat } = useChatSidebarControls();

  const numberOfOnline = onlineUsers.length;
  const privateChatUsers: String[] = [];
  privateChatPreviews.forEach((user) =>
    privateChatUsers.push(user.counterPartyUser.id)
  );

  const renderedPrivateChatPreviews = useMemo(
    () =>
      privateChatPreviews
        // Filter out self
        .filter((chatMessage) => chatMessage.from !== chatMessage.to)
        .map((chatMessage) => (
          <PrivateChatPreview
            key={`${chatMessage.ts_utc}-${chatMessage.from}-${chatMessage.to}`}
            message={chatMessage}
            isOnline={onlineUsers.some(
              (user) => user.id === chatMessage.counterPartyUser.id
            )}
            onClick={() => selectRecipientChat(chatMessage.counterPartyUser.id)}
          />
        )),
    [privateChatPreviews, selectRecipientChat, onlineUsers]
  );

  const renderedOnlineUsers = useMemo(
    () =>
      onlineUsers
        .filter((user) => !privateChatUsers.includes(user.id))
        .map((user) => (
          <OnlineUser
            key={user.id}
            user={user}
            onClick={() => selectRecipientChat(user.id)}
          />
        )),
    [onlineUsers, privateChatUsers, selectRecipientChat]
  );

  const renderedSearchResults = useMemo(
    () =>
      onlineUsers
        .filter((user) =>
          user.partyName?.toLowerCase().includes(userSearchQuery.toLowerCase())
        )
        .map((user) => (
          <OnlineUser
            key={user.id}
            user={user}
            onClick={() => selectRecipientChat(user.id)}
          />
        )),
    [onlineUsers, selectRecipientChat, userSearchQuery]
  );

  const numberOfSearchResults = renderedSearchResults.length;
  const hasChatPreviews = renderedPrivateChatPreviews.length > 0;

  if (recipientId) {
    return (
      <RecipientChat recipientId={recipientId} onAvatarClick={onAvatarClick} />
    );
  }

  return (
    <div className="private-chats">
      <div className="private-chats__search">
        <input
          className="private-chats__search-input"
          placeholder="Search for online people"
          value={userSearchQuery}
          onChange={onInputChage}
        />
        <div className="private-chats__search-icon">
          <FontAwesomeIcon icon={faSearch} size="1x" />
        </div>
      </div>

      {userSearchQuery ? (
        <>
          <p className="private-chats__title-text">
            {numberOfSearchResults} search results
          </p>

          {renderedSearchResults}
        </>
      ) : (
        <>
          {hasChatPreviews && (
            <div className="private-chats__previews">
              {renderedPrivateChatPreviews}
            </div>
          )}

          <p className="private-chats__title-text">
            {numberOfOnline} connected people
          </p>

          {renderedOnlineUsers}
        </>
      )}
    </div>
  );
};
