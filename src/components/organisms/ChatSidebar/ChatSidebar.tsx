import React, { useCallback } from "react";

import { WorldChat, VenueChat, PrivateChat } from "./components";

import { useChatControls, useChatInfo } from "hooks/chats";

import { CHAT_TYPES } from "types/Chat";

export const ChatSidebar: React.FC = () => {
  const { isChatOpened, selectTab, selectedTab } = useChatControls();
  const {
    worldChatTabTitle,
    privateChatTabTitle,
    venueChatTabTitle,
  } = useChatInfo();

  const selectWorldChatTab = useCallback(() => {
    selectTab(CHAT_TYPES.WORLD_CHAT);
  }, [selectTab]);

  const selectPrivateChatTab = useCallback(() => {
    selectTab(CHAT_TYPES.PRIVATE_CHAT);
  }, [selectTab]);

  const selectVenueChatTab = useCallback(() => {
    selectTab(CHAT_TYPES.VENUE_CHAT);
  }, [selectTab]);

  return (
    <div className="chat-sidebar-component">
      <div className="chat-sidebar-header">
        {isChatOpened ? (
          <div className="chat-sidebar-control_close">Close</div>
        ) : (
          <div className="chat-sidebar-control_open">Open</div>
        )}

        <div className="chat-sidebar-tabs">
          <div className="chat-sidebar-tab_world" onClick={selectWorldChatTab}>
            {worldChatTabTitle}
          </div>
          <div
            className="chat-sidebar-tab_private"
            onClick={selectPrivateChatTab}
          >
            {privateChatTabTitle}
          </div>
          <div className="chat-sidebar-tab_venue" onClick={selectVenueChatTab}>
            {venueChatTabTitle}
          </div>
        </div>
      </div>
      <div className="chat-sidebar-content">
        {selectedTab === CHAT_TYPES.PRIVATE_CHAT && PrivateChat}
        {selectedTab === CHAT_TYPES.WORLD_CHAT && WorldChat}
        {selectedTab === CHAT_TYPES.VENUE_CHAT && VenueChat}
      </div>
    </div>
  );
};
