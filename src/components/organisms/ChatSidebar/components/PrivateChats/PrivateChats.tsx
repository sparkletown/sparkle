import React, { useCallback, useMemo, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import { useChatSidebarControls } from "hooks/chats/chatSidebar";
import { useOnlineUsersToDisplay } from "hooks/chats/privateChats/useOnlineUsersToDisplay";
import { usePrivateChatPreviews } from "hooks/chats/privateChats/usePrivateChatPreviews";

import { InputField } from "components/atoms/InputField";

import { OnlineUser, PrivateChatPreview, RecipientChat } from "..";

import "./PrivateChats.scss";

export interface PrivateChatsProps {
  venue: WithId<AnyVenue>;
  recipientId?: string;
}

export const PrivateChats: React.FC<PrivateChatsProps> = ({
  recipientId,
  venue,
}) => {
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const onInputChange = useCallback(
    (e) => setUserSearchQuery(e.target.value),
    []
  );

  const { privateChatPreviews } = usePrivateChatPreviews();
  const onlineUsers = useOnlineUsersToDisplay();
  const { selectRecipientChat } = useChatSidebarControls();

  const privateChatUserIds = useMemo(
    () =>
      privateChatPreviews.map((chatPreview) => chatPreview.counterPartyUser.id),
    [privateChatPreviews]
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
            onClick={() => selectRecipientChat(chatMessage.counterPartyUser.id)}
          />
        )),
    [privateChatPreviews, selectRecipientChat]
  );

  const renderedOnlineUsers = useMemo(
    () =>
      onlineUsers
        .filter((user) => !privateChatUserIds.includes(user.id))
        .map((user) => (
          <OnlineUser
            key={user.id}
            user={user}
            onClick={() => selectRecipientChat(user.id)}
          />
        )),
    [onlineUsers, privateChatUserIds, selectRecipientChat]
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
  const numberOfOtherOnlineUsers = renderedOnlineUsers.length;

  if (recipientId) {
    return <RecipientChat recipientId={recipientId} venue={venue} />;
  }

  return (
    <div className="private-chats">
      <InputField
        containerClassName="private-chats__search"
        placeholder="Search for online people"
        value={userSearchQuery}
        onChange={onInputChange}
        iconStart={faSearch}
        autoComplete="off"
      />

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
            {numberOfOtherOnlineUsers} other online people
          </p>

          {renderedOnlineUsers}
        </>
      )}
    </div>
  );
};
