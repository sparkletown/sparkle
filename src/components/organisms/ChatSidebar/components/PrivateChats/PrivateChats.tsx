import React, { useCallback, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { PrivateChatPreview, RecipientChat, OnlineUser } from "../";

import { SetSelectedProfile } from "types/chat";

import { usePrivateChatPreviews } from "hooks/privateChats";
import { useChatSidebarControls } from "hooks/chatSidebar";
import { useRecentWorldUsers } from "hooks/users";

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
  const { selectRecipientChat } = useChatSidebarControls();
  const { recentWorldUsers } = useRecentWorldUsers();

  const numberOfRecentWorldUsers = recentWorldUsers.length;

  const renderedPrivateChatPreviews = useMemo(
    () =>
      privateChatPreviews.map((chatMessage) => (
        <PrivateChatPreview
          key={`${chatMessage.ts_utc}-${chatMessage.from}-${chatMessage.to}`}
          message={chatMessage}
          isOnline={recentWorldUsers.some(
            (user) => user.id === chatMessage.counterPartyUser.id
          )}
          onClick={() => selectRecipientChat(chatMessage.counterPartyUser.id)}
        />
      )),
    [privateChatPreviews, selectRecipientChat, recentWorldUsers]
  );

  const renderedOnlineUsers = useMemo(
    () =>
      recentWorldUsers.map((user) => (
        <OnlineUser
          key={user.id}
          user={user}
          onClick={() => selectRecipientChat(user.id)}
        />
      )),
    [recentWorldUsers, selectRecipientChat]
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
            onClick={() => selectRecipientChat(user.id)}
          />
        )),
    [recentWorldUsers, selectRecipientChat, userSearchQuery]
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
            {numberOfRecentWorldUsers} connected people
          </p>

          {renderedOnlineUsers}
        </>
      )}
    </div>
  );
};
