import React, { useCallback, useMemo, useState } from "react";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { InputField } from "components/atoms/InputField";

import { AnyVenue } from "types/venues";

import { WithId } from "utils/id";

import {
  usePrivateChatPreviews,
  useOnlineUsersToDisplay,
} from "hooks/privateChats";
import { useChatSidebarControls } from "hooks/chatSidebar";

import { PrivateChatPreview, RecipientChat, OnlineUser } from "..";

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

  const hasChatPreviews = renderedPrivateChatPreviews.length > 0;

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
          <p className="private-chats__title-text">Search results</p>

          {renderedSearchResults}
        </>
      ) : (
        <>
          {hasChatPreviews && (
            <div className="private-chats__previews">
              {renderedPrivateChatPreviews}
            </div>
          )}
        </>
      )}
    </div>
  );
};
