import React, { useMemo } from "react";

import { UserId } from "types/id";
import { DisplayUser } from "types/User";

import { WithId } from "utils/id";

import { usePrivateChatPreviews } from "hooks/chats/private/usePrivateChatPreviews";
import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useRelatedVenues } from "hooks/useRelatedVenues";

import { OnlineUser, PrivateChatPreview, RecipientChat } from "..";

import styles from "./PrivateChats.module.scss";

export interface PrivateChatsProps {
  recipient: WithId<DisplayUser> | undefined;
  userId: UserId;
}

export const PrivateChats: React.FC<PrivateChatsProps> = ({
  recipient,
  userId,
}) => {
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
      sovereignVenue?.recentUsersSample
        ?.filter((x) => x.id !== userId)
        ?.map((user) => (
          <OnlineUser
            key={user.id}
            user={user}
            onClick={() => selectRecipientChat(user)}
          />
        )),
    [sovereignVenue?.recentUsersSample, userId, selectRecipientChat]
  );

  const numberOfUsers = sovereignVenue?.recentUserCount;
  const hasChatPreviews = renderedPrivateChatPreviews.length > 0;

  if (recipient) {
    return <RecipientChat recipient={recipient} />;
  }

  return (
    <div className={styles.privateChatsContainer}>
      {hasChatPreviews && (
        <div className="private-chats__previews">
          {renderedPrivateChatPreviews}
        </div>
      )}

      <p className="private-chats__title-text">
        {numberOfUsers} online people. Here is a handful of other online people:
      </p>

      {renderedUsers}
    </div>
  );
};
