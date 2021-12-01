import React, { useMemo } from "react";

import { DisplayUser } from "types/User";

import { WithId } from "utils/id";

import { usePrivateChatPreviews } from "hooks/chats/private/usePrivateChatPreviews";
import { useChatSidebarControls } from "hooks/chats/util/useChatSidebarControls";
import { useSpaceBySlug } from "hooks/spaces/useSpaceBySlug";
import { useSpaceParams } from "hooks/spaces/useSpaceParams";
import { useUser } from "hooks/useUser";

import { OnlineUser, PrivateChatPreview, RecipientChat } from "..";

import "./PrivateChats.scss";

export interface PrivateChatsProps {
  recipient: WithId<DisplayUser> | undefined;
}

export const PrivateChats: React.FC<PrivateChatsProps> = ({ recipient }) => {
  const { spaceSlug } = useSpaceParams();
  const { space } = useSpaceBySlug(spaceSlug);

  const { userId } = useUser();

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
      space?.recentUsersSample
        ?.filter((x) => x.id !== userId)
        ?.map((user) => (
          <OnlineUser
            key={user.id}
            user={user}
            onClick={() => selectRecipientChat(user)}
          />
        )),
    [space?.recentUsersSample, userId, selectRecipientChat]
  );

  const numberOfUsers = space?.recentUserCount;
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
        {numberOfUsers} online people. Here is a handful of other online people:
      </p>

      {renderedUsers}
    </div>
  );
};
