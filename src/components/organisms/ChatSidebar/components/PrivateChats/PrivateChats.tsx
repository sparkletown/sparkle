import React, { useMemo } from "react";

import { ChatUser } from "types/chat";

import { WithId } from "utils/id";

import { useChatSidebarControls } from "hooks/chats/chatSidebar";
import { usePrivateChatPreviews } from "hooks/chats/privateChats/usePrivateChatPreviews";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { OnlineUser, PrivateChatPreview, RecipientChat } from "..";

import "./PrivateChats.scss";

export interface PrivateChatsProps {
  recipient: WithId<ChatUser> | undefined;
}

export const PrivateChats: React.FC<PrivateChatsProps> = ({ recipient }) => {
  const { sovereignVenue } = useRelatedVenues();

  const { privateChatPreviews } = usePrivateChatPreviews();
  const { selectRecipientChat } = useChatSidebarControls();

  const renderedPrivateChatPreviews = useMemo(
    () =>
      privateChatPreviews
        // NOTE: Filter out self
        .filter((chatMessage) => chatMessage.fromUser !== chatMessage.toUser)
        .map((chatMessage) => (
          <PrivateChatPreview
            key={`${chatMessage.timestamp}-${chatMessage.fromUser}-${chatMessage.toUser}`}
            message={chatMessage}
            onClick={() => selectRecipientChat(chatMessage.counterPartyUser)}
          />
        )),
    [privateChatPreviews, selectRecipientChat]
  );

  const renderedUsers = useMemo(
    () =>
      sovereignVenue?.recentUsersSample?.map((user) => (
        <OnlineUser
          key={user.id}
          user={user}
          onClick={() => selectRecipientChat(user)}
        />
      )),
    [sovereignVenue?.recentUsersSample, selectRecipientChat]
  );

  const numberOfUsers = sovereignVenue?.recentUserCount;
  const hasChatPreviews = renderedPrivateChatPreviews.length > 0;

  if (recipient) {
    return <RecipientChat recipient={recipient} />;
  }

  return (
    <div className="private-chats" id="private_chats_scrollable_div">
      {hasChatPreviews && (
        <div className="private-chats__previews">
          {renderedPrivateChatPreviews}
        </div>
      )}

      <p className="private-chats__title-text">
        {numberOfUsers} other online people
      </p>

      {renderedUsers}
    </div>
  );
};
