import React, { useCallback, useMemo, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

import { PRIVATE_CHAT_NEXT_RENDER_SIZE } from "settings";

import { useChatSidebarControls } from "hooks/chats/chatSidebar";
import { useOnlineUsersToDisplay } from "hooks/chats/privateChats/useOnlineUsersToDisplay";
import { usePrivateChatPreviews } from "hooks/chats/privateChats/usePrivateChatPreviews";

import { Loading } from "components/molecules/Loading";

import { InputField } from "components/atoms/InputField";

import { OnlineUser, PrivateChatPreview, RecipientChat } from "..";

import "./PrivateChats.scss";

export interface PrivateChatsProps {
  recipientId?: string;
}

export const PrivateChats: React.FC<PrivateChatsProps> = ({ recipientId }) => {
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [scrollPageNumber, setScrollPageNumber] = useState(1);

  const onInputChange = useCallback((e) => {
    setUserSearchQuery(e.target.value);
    setScrollPageNumber(1);
  }, []);

  const showNextPage = () => setScrollPageNumber(scrollPageNumber + 1);

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

  const filteredUsers = useMemo(() => {
    if (userSearchQuery.length)
      return onlineUsers.filter((user) =>
        user.partyName?.toLowerCase().includes(userSearchQuery.toLowerCase())
      );
    return onlineUsers.filter((user) => !privateChatUserIds.includes(user.id));
  }, [onlineUsers, privateChatUserIds, userSearchQuery]);

  const renderedUsers = useMemo(
    () =>
      filteredUsers
        .slice(0, scrollPageNumber * PRIVATE_CHAT_NEXT_RENDER_SIZE)
        .map((user) => (
          <OnlineUser
            key={user.id}
            user={user}
            onClick={() => selectRecipientChat(user.id)}
          />
        )),
    [filteredUsers, scrollPageNumber, selectRecipientChat]
  );

  const numberOfUsers = filteredUsers.length;
  const hasChatPreviews = renderedPrivateChatPreviews.length > 0;

  if (recipientId) {
    return <RecipientChat recipientId={recipientId} />;
  }

  return (
    <div className="private-chats" id="private_chats_scrollable_div">
      <InfiniteScroll
        dataLength={renderedUsers.length}
        hasMore={renderedUsers.length < filteredUsers.length}
        next={showNextPage}
        scrollableTarget="private_chats_scrollable_div"
        loader={<Loading />}
      >
        <InputField
          containerClassName="private-chats__search"
          placeholder="Search for online people"
          value={userSearchQuery}
          onChange={onInputChange}
          iconStart={faSearch}
          autoComplete="off"
        />

        {userSearchQuery ? (
          <p className="private-chats__title-text">
            {numberOfUsers} search results
          </p>
        ) : (
          <>
            {hasChatPreviews && (
              <div className="private-chats__previews">
                {renderedPrivateChatPreviews}
              </div>
            )}

            <p className="private-chats__title-text">
              {numberOfUsers} other online people
            </p>
          </>
        )}

        {renderedUsers}
      </InfiniteScroll>
    </div>
  );
};
